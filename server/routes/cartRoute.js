import express from 'express';

import authUser from '../middlewares/authUser.js';
import { updateCart, mergeCart } from '../controllers/cartController.js';


const cartRouter =  express.Router();

cartRouter.post('/update', authUser , updateCart);

cartRouter.post('/merge', authUser, mergeCart);


export default cartRouter

