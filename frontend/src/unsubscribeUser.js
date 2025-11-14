export const unsubscribeUser = async () => {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;

  // ✅ Get existing subscription
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  const endpoint = subscription.endpoint;

  // ✅ Unsubscribe from browser
  await subscription.unsubscribe();

  // ✅ Remove from backend
  await fetch(
    // "https://poultry-feed-management-software-3.onrender.com/api/notifications/remove-subscription",
    "http://localhost:5000/api/notifications/remove-subscription",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ endpoint }),
    }
  );
};
