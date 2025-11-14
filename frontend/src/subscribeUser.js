export const subscribeUser = async (
  employeeId,
  role,
  browserId,
  PUBLIC_VAPID_KEY
) => {
  const register = await navigator.serviceWorker.register("/service-worker.js");

  // Check existing subscription
  let subscription = await register.pushManager.getSubscription();

  if (!subscription) {
    // If not exists, create new one
    const urlBase64ToUint8Array = (base64String) => {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    };

    subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });
  }

  // Save subscription in backend
  await fetch(
    // "https://poultry-feed-management-software-3.onrender.com/api/notifications/save-subscription",
    "http://localhost:5000/api/notifications/save-subscription",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        employeeId,
        role,
        subscription,
        browserId,
      }),
    }
  );
};
