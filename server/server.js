import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors'
import connectDB from "./configs/db.js";
import 'dotenv/config';
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhook } from "./controllers/orderController.js";

const app = express();

const Port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();



// allow multiple origins
const allowedOrigins = ['http://localhost:5173']


app.post('/stripe', express.raw({type : "application/json"}), stripeWebhook)

// Middeleweare configuration

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials :true }))


app.get("/" ,(req,res) =>{res.send("api is working")});

app.use("/api/user", userRouter);
app.use('/api/seller' , sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);


app.listen(Port ,()=>{
    console.log(`server is running on http://localhost:${Port}`);
})