
import User from "../models/User.js";


// update user CartData : /api/cart/update



export const updateCart = async (req , res) =>{
    // try {
    //     const { cartItems} = req.body;
    //     const userId = req.userId;

    //     await User.findByIdAndUpdate(userId , {cartItems}, {new : true});
    //     res.json({ success:true , message : "cart Updated"});


    // } catch (error) {
    //     console.log(error.message);
    //     res.json({ success : false , message: error.message});
    // }




     try {
        const { cartItems } = req.body;
        const userId = req.userId;

        // normalize data
        const safeCart = cartItems.map(item => ({
            productId: item.productId,
            quantity: Number(item.quantity)
        }));

        await User.findByIdAndUpdate(
            userId,
            { cartItems: safeCart },
            { new: true }
        );

        res.json({ success: true, message: "Cart updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}