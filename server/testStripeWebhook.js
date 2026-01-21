import axios from "axios";

const orderId = "6970f226b3ec02861104f1b3"; // from DB
const userId = "6970f1f7b3ec02861104f192";   // from DB

async function simulateStripeWebhook() {
  try {
    const res = await axios.post(
      "http://localhost:4000/api/order/stripe-webhook",
      {
        type: "checkout.session.completed",
        data: { object: { metadata: { orderId, userId } } },
      },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("✅ Simulated webhook sent successfully", res.data);
  } catch (err) {
    if (err.response) {
      console.error("❌ Response error:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("❌ No response received, request error:", err.message);
    } else {
      console.error("❌ Axios setup error:", err.message);
    }
  }
}

simulateStripeWebhook();
