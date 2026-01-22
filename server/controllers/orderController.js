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


        // 🔥 CLEAR CART
        await User.findByIdAndUpdate(userId, { cartItems: [] });

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
        address: address,
        paymentType: "Online",
        isPaid: false,            // ✅ REQUIRED
        paymentStatus: "Pending" // ✅ REQUIRED
        });


          // ===== CLEAR CART IMMEDIATELY =====
    await User.findByIdAndUpdate(userId, { cartItems: [] },{new: true});

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



// // Stripe webhook to confirm payment


export const stripeWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    if (sig) {
      // ✅ Production: verify Stripe signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log("✅ Stripe webhook verified successfully");
    } else {
      // ⚡ Local development simulation
      event = req.body; // assume axios simulation sends the same structure
      console.log("⚡ Simulated Stripe webhook received (local dev)");
    }
  } catch (error) {
    console.error(
      "❌ Stripe webhook signature verification failed:",
      error.message
    );
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { orderId, userId } = session.metadata;

        console.log("Stripe session metadata:", session.metadata);

        // mark order as paid
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          paymentStatus: "Paid",
        });

        // clear user's cart (works for local dev too)
        await User.findByIdAndUpdate(userId, { cartItems: [] });

        console.log(`Order ${orderId} marked as paid and cart cleared`);
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        const { orderId } = session.metadata;

        // mark order as failed
        await Order.findByIdAndUpdate(orderId, { paymentStatus: "Failed" });

        console.log(`Order ${orderId} payment failed`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook processing error:", err.message);
    res.status(500).send(`Webhook handler failed: ${err.message}`);
  }
};



// export const stripeWebhook = async (req, res) => {
//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//     const sig = req.headers["stripe-signature"];
//     let event;


// try {
//     // 🔹 Check if this is a real Stripe webhook (production)
//     if (sig) {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//       console.log("✅ Stripe webhook verified successfully");
//     } else {
//       // 🔹 Local development simulation
//       event = req.body;
//       console.log("⚡ Simulated Stripe webhook received (local dev)");
//     }
//   } catch (error) {
//     console.error(
//       "❌ Stripe webhook signature verification failed:",
//       error.message
//     );
//     return res.status(400).send(`Webhook Error: ${error.message}`);
//   }

//     try {
//         switch (event.type) {

//             case "checkout.session.completed": {
//                 const session = event.data.object;

//                  console.log("Stripe session metadata:", session.metadata);

//                 // metadata we sent when creating session
//                 const { orderId, userId } = session.metadata;

//                 // mark order as paid
//                 await Order.findByIdAndUpdate(
//                      orderId,   
//                     { isPaid: true, paymentStatus: "Paid" }
//                 );

            
//                 // clear user's cart
//                 await User.findByIdAndUpdate(userId, { cartItems: [] }, { new: true });

//                 console.log(`Order ${orderId} marked as paid`);

//                 break;
//             }

//             case "checkout.session.async_payment_failed": {
//                 const session = event.data.object;
//                 const { orderId } = session.metadata;

//                 // optional: delete order or mark failed
//                 await Order.findByIdAndUpdate(orderId, { paymentStatus: "Failed" });

//                 console.log(`Order ${orderId} payment failed`);
//                 break;
//             }

//             default:
//                 console.log(`Unhandled event type ${event.type}`);
//         }

//         res.json({ received: true });
//     } catch (err) {
//         console.error("Stripe webhook processing error:", err.message);
//         res.status(500).send(`Webhook handler failed: ${err.message}`);
//     }
// };






// get Order by userId :  /api/order/user


export const getUserOrders = async (req , res) =>{

    try {

        const userId = req.userId;

        const orders = await Order.find({
            userId,
            $or : [ { paymentType: "COD"} ,   { paymentType: "Online" }]
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
        const orders = await Order.find({})
            .populate("items.product address")
            .sort({createdAt: -1});

        res.json({success : true, orders});
    } catch (error) {
        console.log(error.message);
        res.json({ success : false , message: error.message});   
    }

    // try {


    //     const orders = await Order.find({
    //         $or : [ { paymentType: "COD"} , {isPaid : true}]
    //     }).populate("items.product address").sort({createdAt : -1});


    //     res.json({success : true, orders});
        
    // } catch (error) {
    //     console.log(error.message);
    //     res.json({ success : false , message: error.message});   
    // }
    
}



