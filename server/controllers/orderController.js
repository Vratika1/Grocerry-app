import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';
import User from '../models/User.js';



// place order cod : /api/order/cod
export const placeOderCOD = async (req , res ) => {
    try {
        
        const { items , address} = req.body;
        const userId = req.userId;

       
        if (!address || !items || items.length === 0) {
        return res.json({ success: false, message: "Invalid data" });
        }

        let amount = 0;
        const validItems = [];

        // for (const item of items) {
        // const product = await Product.findById(item.product); // backend expects 'product'
        // if (!product) continue; // skip deleted/missing products


        // const quantity = Number(item.quantity); 

        // amount += product.offerPrice * quantity;
        // validItems.push(item);
        // }


        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) continue;

            const quantity = Number(item.quantity); // convert to number

            // amount calculation
            amount += product.offerPrice * quantity;

            // push to validItems with numeric quantity
            validItems.push({
                product: item.product,  // product ID
                quantity: quantity
            });
        }


        if (validItems.length === 0) {
        return res.json({ success: false, message: "No valid products in cart" });
        }

        // add 2% tax
        amount += Math.round(amount * 0.02);

        await Order.create({
        userId,
        items: validItems,
        amount,
        address,
        paymentType: "COD",
        });


        return res.json({success : true, message : " Order Placed SuccessFully"})

    } catch (error) {

        console.log(error.message);
        res.json({ success : false , message: error.message});
        
    }
}







// place order Stripe : /api/order/stripe
export const placeOderStripe = async (req , res ) => {
    try {
        
        const { items , address} = req.body;
        const userId = req.userId;

        const { origin} = req.headers;


       
        if (!address || !items || items.length === 0) {
        return res.json({ success: false, message: "Invalid data" });
        }


        let productData = [];

        let amount = 0;
        const validItems = [];

        // for (const item of items) {
        // const product = await Product.findById(item.product); // backend expects 'product'
        // productData.push({
        //     name : product.name,
        //     price : product.offerPrice,
        //     quantity : item.quantity,
        // });

        // if (!product) continue; // skip deleted/missing products

        // const quantity = Number(item.quantity); 

        // amount += product.offerPrice * quantity;
        // validItems.push(item);
        // }


        for (const item of items) {
            const product = await Product.findById(item.product); // backend expects 'product'
            if (!product) continue; // skip deleted/missing products

            const quantity = Number(item.quantity); // convert to number

            // amount calculation
            amount += product.offerPrice * quantity;

            // push object with numeric quantity
            validItems.push({
                product: item.product, // backend expects 'product' id
                quantity: quantity
            });

            // stripe data
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: quantity
            });
        }


        if (validItems.length === 0) {
        return res.json({ success: false, message: "No valid products in cart" });
        }

        // add 2% tax
        amount += Math.round(amount * 0.02);

        const order = await Order.create({
        userId,
        items: validItems,
        amount,
        address,
        paymentType: "Online",
        });

        // STRIPE PAYMENT INTEGRATION

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        // create line items for stripe

        const lineItems = productData.map((item) => {

            return{
                price_data : {
                    currency : "inr",
                    product_data : {
                        name : item.name,
                    },
                    unit_amount: Math.round(Number(item.price) * 1.02 * 100)


            },
            quantity : Number(item.quantity),
        }});


        const totalAmount = productData.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity) * 1.02,
            0
        );

        if(totalAmount < 50){ // minimum safe amount in INR
            return res.status(400).json({
                success: false,
                message: "Minimum order amount for Stripe payment is ₹50"
            });
        }


        // create session

        const session = await stripe.checkout.sessions.create({line_items : lineItems,
            mode : "payment",
            success_url : `${origin}/loader?next=my-orders`,
            cancel_url : `${origin}/cart`,
            metadata : {orderId : order._id.toString(),
                userId : userId
            }
        })

        return res.json({success : true, url : session.url})

    } catch (error) {

        console.log(error.message);
        res.json({ success : false , message: error.message});
        
    }
}



// Stripe webhook to confirm payment
export const stripeWebhook = async (req , res) =>{

    // stripe gateway initialization
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const sig = req.headers["stripe-signature"];

    let event;


    try {
        event = stripe.webhooks.constructEvent(req.body , sig , process.env.STRIPE_WEBHOOK_SECRET);

    } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`);
    }


    // handle the event

    switch (event.type) {

        case "payment_intent.succeeded" : {

            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // getting session meta data

            const session = await stripe.checkout.sessions.list({
                payment_intent : paymentIntentId,

            }) ;

            const { orderId , userId} = session.data[0].metadata;

            // update order status

            await Order.findByIdAndUpdate(orderId , {
                isPaid : true,
            }, { new : true }
                
            )

            await User.findByIdAndUpdate(userId, {cartItems: {}}, { new : true});

            break;


        }


        case "payment_intent.payment_failed" : {

              const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // getting session meta data

            const session = await stripe.checkout.sessions.list({
                payment_intent : paymentIntentId,

            }) ;

            const { orderId , userId} = session.data[0].metadata;

            await Order.findByIdAndDelete(orderId);
            break;

        }
        default :
            console.log(`Unhandled event type ${event.type}`);
            break;

    }

    res.json({received : true});


}





// get Order by userId :  /api/order/user


export const getUserOrders = async (req , res) =>{

    try {

        const userId = req.userId;

        const orders = await Order.find({
            userId,
            $or : [ { paymentType: "COD"} , {isPaid : true}]
        }).populate("items.product address").sort({createdAt : -1});

          

        res.json({success : true, orders});
        
    } catch (error) {

        console.log(error.message);
        res.json({ success : false , message: error.message});
        
    }
}




// All order data for admin : /api/orders/seller

export const getAllOrders = async (req , res) =>{

    try {


        const orders = await Order.find({
            $or : [ { paymentType: "COD"} , {isPaid : true}]
        }).populate("items.product address").sort({createdAt : -1});


        res.json({success : true, orders});
        
    } catch (error) {
        console.log(error.message);
        res.json({ success : false , message: error.message});   
    }
}



