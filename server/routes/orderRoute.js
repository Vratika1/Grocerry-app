import express from 'express';
import { getAllOrders, getUserOrders, placeOderCOD , placeOderStripe, testPaymentWebhook, verifyStripePayment } from '../controllers/orderController.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';
// import bodyParser from "body-parser"; // ✅ Add this import
// import { stripeWebhook } from "../controllers/orderController.js"; // ✅ named import


const orderRouter = express.Router();

orderRouter.post('/cod' , authUser , placeOderCOD);
orderRouter.post('/stripe' , authUser , placeOderStripe);
orderRouter.post('/verify-stripe' , authUser , verifyStripePayment);  // ✅ Verify after redirect
orderRouter.get('/user' , authUser , getUserOrders);
orderRouter.get('/seller' , authSeller , getAllOrders);
orderRouter.get('/test-payment/:orderId', testPaymentWebhook);  // 🧪 TEST ENDPOINT


// Stripe webhook route
// orderRouter.post(
//  '/stripe-webhook',               // full route: /api/order/stripe-webhook
//   bodyParser.raw({ type: 'application/json' }),
//   stripeWebhook
// );

export default orderRouter;
