import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  lazy,
  Suspense,
} from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser.js";
import {
  Button,
  ButtonGroup,
  CircularProgress,
  IconButton,
} from "@mui/material";
import useEmployees from "../hooks/useEmployees.js";
import Avatar from "./Avatar.jsx";
import { MessageCircleWarning, SendHorizontal, Smile, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import socket from "../utils/socket.js";
import { format, isToday, isYesterday } from "date-fns";
import "../App.css";
import { MyEmojiPicker } from "./EmojiPicker.jsx";
import useNotification from "../hooks/useNotification.js";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "../context/ThemeContext.jsx";

const AdminNotification = ({ setIsOpenNotification }) => {
  const { resolvedTheme } = useTheme();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const token = localStorage.getItem("token");
  const { salesman, salesmanager, salesauthorizer, planthead, accountant } =
    useEmployees();

  const handleEmojiSelect = (emoji) => {
    setTypedMessage((prev) => prev + emoji.emoji);
  };

  const [selectedTab, setSelectedTab] = useState("all-dashboards");
  const [selectedDashboard, setSelectedDashboard] = useState("All");

  const [typedMessage, setTypedMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [openEmoji, setOpenEmoji] = useState(false);
  const { clearNotifications, loadingClearNotifications } = useNotification();
  const [activeTab, setActiveTab] = useState("notifications");
  const tabType = ["notifications", "messages"];

  const messagesEndRef = useRef(null);

  const handleClearNotifications = () => {
    clearNotifications();
    setNotifications([]);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  // Memoize all employees array
  const allEmployees = useMemo(
    () => [
      ...(salesman || []),
      ...(salesmanager || []),
      ...(salesauthorizer || []),
      ...(planthead || []),
      ...(accountant || []),
    ],
    [salesman, salesmanager, salesauthorizer, planthead, accountant]
  );

  // Memoize selected employee
  const selectedEmployee = useMemo(() => {
    if (selectedTab === "all-dashboards") return "all-dashboards";
    return allEmployees.find((e) => e._id === selectedTab) || null;
  }, [selectedTab, allEmployees]);

  const joinChatRoom = (empId) => {
    setSelectedTab(empId);
    setSelectedDashboard("");
    setMessages([]); // Clear messages when switching

    if (currentRoomId && currentRoomId !== empId) {
      socket.emit("leaveRoom", currentRoomId);
    }

    socket.emit("joinChatRoom", empId);
    setCurrentRoomId(empId);
  };
  // Stable handlers to avoid duplicate bindings
  const handleNotification = useCallback((data) => {
    // console.log("New notification:", data);
    const normalized = {
      ...data,
      createdAt: data?.createdAt || data?.timestamp || new Date().toISOString(),
    };
    setNotifications((prev) => [normalized, ...prev]);
  }, []);

  const handleMessage = useCallback(
    (data) => {
      if (!data) return;

      const involvesAdmin = [data.senderId, data.receiverId].includes(
        user?._id
      );
      if (!involvesAdmin) return;

      if (
        selectedEmployee &&
        selectedEmployee !== "all-dashboards" &&
        ![data.senderId, data.receiverId].includes(selectedEmployee._id)
      ) {
        return;
      }

      setMessages((prev) => {
        const messageExists = prev.some((msg) => {
          const ts1 = msg?.timestamp ? new Date(msg.timestamp).getTime() : 0;
          const ts2 = data?.timestamp ? new Date(data.timestamp).getTime() : 0;
          return (
            msg.senderId === data.senderId &&
            msg.receiverId === data.receiverId &&
            msg.message === data.message &&
            ts1 === ts2
          );
        });
        if (messageExists) return prev;
        return [...prev, data];
      });
    },
    [user?._id, selectedEmployee]
  );

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!typedMessage.trim()) return;

    const data = {
      senderId: user._id,
      senderName: user.name,
      receiverId: selectedEmployee._id,
      receiverName: selectedEmployee.name,
      message: typedMessage.trim(),
      roomId: selectedEmployee._id || selectedDashboard,
      timestamp: new Date(),
      type: "message",
    };

    socket.emit("sendMessage", data);
    setTypedMessage("");
  };

  // Fetch notifications history
  useEffect(() => {
    if (!user?._id) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/notifications/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sorted = (res?.data?.data || []).slice().sort((a, b) => {
          const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta; // newest first
        });
        setNotifications(sorted);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    queryClient.invalidateQueries(["notifications", user._id]);
  }, [user?._id]);

  // Fetch message history
  useEffect(() => {
    if (!user?._id) return;
    if (!selectedEmployee || selectedEmployee === "all-dashboards") {
      setMessages([]);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoadingMessages(true);
        const res = await axios.get(
          `http://localhost:5000/api/messages/${user._id}/${selectedEmployee._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(res.data.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchHistory();
    queryClient.invalidateQueries(["notifications", user._id]);
  }, [selectedEmployee]);

  // handling notifications
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);

    const notificationEvents = [
      "orderCreated",
      "orderForwardedToAuthorizer",
      "plantAssigned",
      "plantApproved",
      "dispatched",
      "invoiceGenerated",
      "orderCancelled",
      "dueInvoiceGenerated",
      "delivered",
    ];

    // Attach listeners
    notificationEvents.forEach((event) => {
      socket.on(event, handleNotification);
    });
    socket.on("receiveMessage", handleMessage);

    // Cleanup
    return () => {
      notificationEvents.forEach((event) => {
        socket.off(event, handleNotification);
      });
      socket.off("receiveMessage", handleMessage);
    };
  }, [user?._id, handleNotification, handleMessage]);

  const generateRoomId = [
    [...salesman?.map((emp) => emp._id)],
    [...salesmanager?.map((emp) => emp._id)],
    [...salesauthorizer?.map((emp) => emp._id)],
    [...planthead?.map((emp) => emp._id)],
    [...accountant?.map((emp) => emp._id)],
  ];

  const allUsers = [...new Set(generateRoomId.flat())];
  console.log(allUsers);

  useEffect(() => {
    socket.emit("joinExecutives", user._id);
  }, [user._id, selectedDashboard]);

  // Employee list component
  const EmployeeList = ({ title, employees }) => (
    <div className="flex flex-col items-start w-full px-2 transition-all">
      <p className="text-gray-500 text-sm mb-1 dark:text-gray-400">{title}</p>
      {employees?.map((emp) => (
        <Button
          key={emp._id}
          disableElevation
          disableRipple={selectedTab === emp._id}
          disabled={selectedTab === emp._id}
          variant={selectedTab === emp._id ? "contained" : "text"}
          sx={{
            textTransform: "none",
            color:
              selectedTab === emp._id
                ? "white"
                : `${resolvedTheme === "dark" ? "white" : "#1f2937"}`,
            marginBottom: "5px",
            padding: "4px 15px",
            justifyContent: "flex-start",
            fontSize: "16px",
            fontWeight: "400",
            width: "100%",
            fontFamily: "'Inter', sans-serif",
            "&.Mui-disabled": {
              backgroundColor: "#1976D2",
              color: "white",
            },
          }}
          onClick={() => joinChatRoom(emp._id)}
        >
          {emp.name}
        </Button>
      ))}
    </div>
  );

  // Dashboard button component
  const DashboardButton = ({ dashboard, label }) => (
    <Button
      key={dashboard}
      disableElevation
      disableRipple={selectedDashboard === dashboard}
      disabled={selectedDashboard === dashboard}
      variant={selectedDashboard === dashboard ? "contained" : "text"}
      sx={{
        textTransform: "none",
        color:
          selectedDashboard === dashboard
            ? "white"
            : `${resolvedTheme === "dark" ? "white" : "#1f2937"}`,
        marginBottom: "5px",
        padding: "4px 15px",
        justifyContent: "flex-start",
        fontSize: "16px",
        fontWeight: "400",
        width: "100%",
        fontFamily: "'Inter', sans-serif",
        "&.Mui-disabled": {
          backgroundColor: "#1976D2",
          color: "white",
        },
      }}
      onClick={() => setSelectedDashboard(dashboard)}
    >
      {label}
    </Button>
  );

  //sorted messages
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a?.timestamp) - new Date(b?.timestamp)
  );

  const groupedByDate = sortedMessages.reduce((groups, m) => {
    const msgDate = new Date(m?.timestamp);
    const key = format(msgDate, "yyyy-MM-dd");
    const lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup.key !== key) {
      groups.push({ key, date: msgDate, items: [m] });
    } else {
      lastGroup.items.push(m);
    }
    return groups;
  }, []);

  //sorted notifications (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
  );

  const groupedByDateNotifications = sortedNotifications.reduce((groups, m) => {
    const msgDate = new Date(m?.createdAt);
    const key = format(msgDate, "yyyy-MM-dd");
    const lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup.key !== key) {
      groups.push({ key, date: msgDate, items: [m] });
    } else {
      lastGroup.items.push(m);
    }
    return groups;
  }, []);

  const emojiRegex =
    /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}(?:\p{Emoji_Modifier})?|\p{Emoji_Component})+$/u;

  return (
    <div className="flex items-center justify-center w-full h-full absolute top-0 right-0 bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-sm z-50 transition-all">
      <div className="w-[65%] h-[90%] dark:bg-gray-800 overflow-hidden p-5 flex items-start flex-col bg-white shadow-md rounded-lg z-[9999] transition-all">
        {/* Header - Fixed height */}
        <div className="flex items-center justify-between mb-3 w-full flex-shrink-0 ">
          <p className="text-xl font-bold dark:text-gray-300">
            Notifications & Chats
          </p>
          <IconButton size="small" onClick={() => setIsOpenNotification(false)}>
            <CloseIcon className="text-gray-500" />
          </IconButton>
        </div>

        {user?.role === "Admin" && (
          <div className="w-full flex-1 flex flex-col min-h-0">
            {/* Tab Buttons - Fixed height */}
            <div className="w-full flex-shrink-0">
              <ButtonGroup
                aria-label="Medium-sized button group"
                sx={{ width: "100%" }}
              >
                {tabType.map((tab, i) => (
                  <Button
                    disableElevation
                    key={i}
                    variant={activeTab === tab ? "contained" : "outlined"}
                    sx={{
                      textTransform: "none",
                      width: "100%",
                    }}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "notifications" ? "Notifications" : "Chats"}
                  </Button>
                ))}
              </ButtonGroup>
            </div>

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="w-full flex flex-col flex-1 mt-2 min-h-0">
                {/* Scrollable notifications */}
                <div className="flex-1 overflow-y-auto rounded-xl min-h-0 p-1">
                  {!loading ? (
                    <div>
                      {sortedNotifications?.length === 0 ? (
                        <div className="w-full dark:text-gray-400 h-[500px] text-gray-500 flex items-center justify-center">
                          No notifications
                        </div>
                      ) : (
                        groupedByDateNotifications?.map((group, i) => (
                          <div key={group.key}>
                            <div className="text-center sticky top-0 z-10 py-2 mb-2 text-sm dark:text-gray-300 text-gray-600 bg-transparent">
                              <span className="bg-gray-100 dark:bg-gray-700 shadow-sm px-3 font-semibold text-xs py-1 rounded-full">
                                {isToday(group.date)
                                  ? "Today"
                                  : isYesterday(group.date)
                                  ? "Yesterday"
                                  : format(group.date, "dd MMM, yyyy")}
                              </span>
                            </div>

                            {group?.items?.map((n, i) => (
                              <div
                                key={n?._id || `notification-${group.key}-${i}`}
                              >
                                <div className="p-3 text-sm my-2 relative bg-gray-50 dark:bg-gray-900 border-l-4 border-[#1976D2] rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200">
                                  <div className="flex justify-between items-center">
                                    <p className="text-gray-800 dark:text-gray-300 font-medium">
                                      {n?.message}
                                      {n?.createdAt && (
                                        <span
                                          className={`text-[10px] text-right absolute bottom-1 right-2 ${
                                            n?.createdAt === user._id
                                              ? "text-gray-300"
                                              : "text-gray-500"
                                          }`}
                                        >
                                          {format(n?.createdAt, "h:mm a")}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="flex w-full h-full items-center justify-center">
                      <CircularProgress />
                    </div>
                  )}
                </div>
                {sortedNotifications.length > 0 && (
                  <div className="flex items-center justify-end mt-2 flex-shrink-0">
                    <Button
                      startIcon={<X strokeWidth="1.8" size={17} />}
                      variant="text"
                      color="error"
                      sx={{
                        textTransform: "none",
                        padding: "4px 10px",
                        fontSize: "14px",
                        borderRadius: "999px",
                      }}
                      loading={loadingClearNotifications}
                      onClick={handleClearNotifications}
                    >
                      Clear notifications
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div className="flex w-full flex-1 min-h-0 mt-2">
                {/* Employee List Sidebar */}
                <div className="overflow-y-auto custom-scrollbar min-w-48 flex-shrink-0">
                  <div className="flex flex-col items-start gap-2 w-full px-2">
                    <Button
                      onClick={() => {
                        setSelectedTab("all-dashboards");
                        setSelectedDashboard("All");
                        if (currentRoomId) {
                          socket.emit("leaveRoom", currentRoomId);
                          setCurrentRoomId(null);
                        }
                      }}
                      disableElevation
                      disableRipple={selectedTab === "all-dashboards"}
                      disabled={selectedTab === "all-dashboards"}
                      variant={
                        selectedTab === "all-dashboards" ? "contained" : "text"
                      }
                      sx={{
                        textTransform: "none",
                        color:
                          selectedTab === "all-dashboards"
                            ? "white"
                            : `${
                                resolvedTheme === "dark" ? "white" : "#1f2937"
                              }`,
                        marginBottom: "5px",
                        padding: "4px 15px",
                        justifyContent: "flex-start",
                        fontSize: "16px",
                        fontWeight: "400",
                        width: "100%",
                        fontFamily: "'Inter', sans-serif",
                        "&.Mui-disabled": {
                          backgroundColor: "#1976D2",
                          color: "white",
                        },
                      }}
                    >
                      Executives
                    </Button>
                    <EmployeeList title="Salesmen" employees={salesman} />
                    <EmployeeList title="Managers" employees={salesmanager} />
                    <EmployeeList
                      title="Authorizers"
                      employees={salesauthorizer}
                    />
                    <EmployeeList title="Plant Heads" employees={planthead} />
                    <EmployeeList title="Accountants" employees={accountant} />
                  </div>
                </div>

                {/* Dashboard Filter */}
                {selectedTab === "all-dashboards" && (
                  <div className="min-w-[160px] max-w-[160px] border-r transition-all flex-shrink-0 overflow-y-auto px-2 dark:border-r dark:border-gray-700">
                    <DashboardButton dashboard="All" label="All" />
                    <DashboardButton dashboard="Salesman" label="Salesmen" />
                    <DashboardButton dashboard="Managers" label="Managers" />
                    <DashboardButton
                      dashboard="Authorizers"
                      label="Authorizers"
                    />
                    <DashboardButton
                      dashboard="Plantheads"
                      label="Plant Heads"
                    />
                    <DashboardButton
                      dashboard="Accountants"
                      label="Accountants"
                    />
                  </div>
                )}

                {/* Chat Area */}
                <div className="w-full flex-1 flex flex-col min-h-0 min-w-0 dark:border-l dark:border-gray-700 ">
                  {/* Header - Fixed */}
                  <div className="flex-shrink-0 border-b dark:border-b dark:border-gray-700">
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 w-full flex items-center gap-2">
                      <Avatar
                        size={40}
                        name={selectedEmployee?.name || selectedDashboard}
                      />
                      <div className="flex flex-col">
                        <p className="font-semibold dark:text-gray-200">
                          {selectedDashboard || selectedEmployee.name}
                        </p>
                        <p className="text-xs dark:text-gray-300">
                          {selectedEmployee.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area - Scrollable */}
                  {loadingMessages ? (
                    <div className="flex items-center justify-center w-full flex-1">
                      <div className="flex items-center justify-center gap-3 bg-blue-50 dark:bg-blue-950 p-2 rounded-lg">
                        <CircularProgress size={14} />
                        <p className="text-sm text-[#1976D2]">
                          Loading chats...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2 dark:bg-gray-900 overflow-y-auto custom-scrollbar bg-gray-50 shadow-inner flex-1 min-h-0 relative">
                      {sortedMessages?.length > 0 ? (
                        <div className="flex flex-col">
                          {groupedByDate?.map((group) => (
                            <div key={group.key} className="flex flex-col">
                              <div className="text-center sticky top-0 z-10 py-2 text-sm dark:text-gray-300 text-gray-600 bg-transparent">
                                <span className="bg-gray-200 dark:bg-gray-800 px-3 font-semibold text-xs py-1 rounded-full">
                                  {isToday(group.date)
                                    ? "Today"
                                    : isYesterday(group.date)
                                    ? "Yesterday"
                                    : format(group.date, "dd MMM, yyyy")}
                                </span>
                              </div>
                              {group?.items?.map((m, i) => (
                                <div
                                  key={`message-${
                                    m?._id || `${group.key}-${i}`
                                  }`}
                                  className={`p-2 px-3 text-gray-800 shadow text-sm mb-2 pe-14 rounded-xl relative max-w-[70%] 
                            ${
                              m?.senderId === user._id
                                ? "bg-[#1976D2] text-white self-end rounded-xl rounded-tr-sm"
                                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white self-start rounded-xl rounded-tl-sm"
                            }`}
                                >
                                  <p
                                    className={
                                      "w-full break-words whitespace-pre-wrap" +
                                      (emojiRegex.test(m?.message.trim())
                                        ? " text-center text-2xl"
                                        : "")
                                    }
                                  >
                                    {m?.message}
                                  </p>

                                  {m?.timestamp && (
                                    <p
                                      className={`text-[10px] text-right absolute bottom-1 right-2 ${
                                        m?.senderId === user._id
                                          ? "text-gray-300"
                                          : "text-gray-500 dark:text-gray-200"
                                      }`}
                                    >
                                      {format(m.timestamp, "h:mm a")}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <div className="flex flex-col items-center text-gray-500 p-8  rounded-lg">
                            <MessageCircleWarning size={30} />
                            <h1 className="text-md font-semibold mt-2">
                              Chat seems empty
                            </h1>
                            <p className="text-xs mt-1">
                              Start a conversation with{" "}
                              {selectedDashboard || selectedEmployee?.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Emoji Picker - Absolute positioned */}
                  {openEmoji && (
                    <div className="absolute bottom-20 left-[215px] z-50">
                      <MyEmojiPicker
                        onEmojiSelect={handleEmojiSelect}
                        onClose={() => setOpenEmoji(false)}
                      />
                    </div>
                  )}

                  {/* Input Area - Fixed */}
                  <div className="w-full bg-gray-100 py-2 relative flex-shrink-0 dark:bg-gray-800 dark:border-t dark:border-gray-700">
                    <Smile
                      color={openEmoji ? "#1976D2" : "gray"}
                      size={32}
                      onClick={() => setOpenEmoji(!openEmoji)}
                      className={`absolute top-3 left-2 cursor-pointer active:scale-95 transition-all rounded-full p-1 `}
                    />
                    <form
                      className="flex items-center gap-1 px-1"
                      onSubmit={handleSendMessage}
                    >
                      <input
                        type="text"
                        placeholder="Message"
                        className="w-full p-2 px-4 rounded-full focus:outline-none ps-10 dark:bg-gray-900 dark:text-gray-200"
                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="bg-[#1976D2] hover:bg-[#1976D2]/90 transition-all active:scale-95 rounded-full text-white p-2.5"
                      >
                        <SendHorizontal size={20} />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotification;
