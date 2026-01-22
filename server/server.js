import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors'
import bodyParser from "body-parser"; 
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
const allowedOrigins = [
    'https://grocerry-app-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
]

// Stripe webhook FIRST (before CORS and body parser) - must use raw body
app.post('/stripe', bodyParser.raw({ type: "application/json" }), stripeWebhook)

// Middleware configuration - CORS with permissive origin handling
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman, curl, direct requests)
    if (!origin) return callback(null, true);

    // allow localhost variants for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }

    // allow Vercel deployments
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());


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