import express from 'express';
import { getAllOrders, getUserOrders, placeOderCOD , placeOderStripe } from '../controllers/orderController.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';


const orderRouter = express.Router();

orderRouter.post('/cod' , authUser , placeOderCOD);
orderRouter.post('/stripe' , authUser , placeOderStripe);
orderRouter.get('/user' , authUser , getUserOrders);
orderRouter.get('/seller' , authSeller , getAllOrders);

export default orderRouter;
