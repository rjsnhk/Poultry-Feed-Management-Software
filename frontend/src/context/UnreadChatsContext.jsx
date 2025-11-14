import { createContext, useContext, useState } from "react";

const UnreadChatsContext = createContext();

export const UnreadChatsProvider = ({ children }) => {
  const [unread, setUnread] = useState({});

  return (
    <UnreadChatsContext.Provider value={{ unread, setUnread }}>
      {children}
    </UnreadChatsContext.Provider>
  );
};

export const useUnreadChatsContext = () => useContext(UnreadChatsContext);
