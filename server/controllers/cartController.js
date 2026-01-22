
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


// Merge localStorage cart with MongoDB cart on login : /api/cart/merge
export const mergeCart = async (req, res) => {
    try {
        const { localCartItems } = req.body;
        const userId = req.userId;

        // Get user's current cart from DB
        const user = await User.findById(userId);
        const dbCart = user.cartItems || [];

        // If no local cart, just return DB cart
        if (!localCartItems || !Array.isArray(localCartItems) || localCartItems.length === 0) {
            return res.json({ 
                success: true, 
                message: "No local cart to merge",
                cartItems: dbCart
            });
        }

        // Merge carts: combine quantities for same products
        const mergedCart = [...dbCart];

        localCartItems.forEach(localItem => {
            const existingIndex = mergedCart.findIndex(
                dbItem => String(dbItem.productId) === String(localItem.productId)
            );

            if (existingIndex !== -1) {
                // Product exists in DB cart - add quantities
                mergedCart[existingIndex].quantity += Number(localItem.quantity);
            } else {
                // New product - add to cart
                mergedCart.push({
                    productId: localItem.productId,
                    quantity: Number(localItem.quantity)
                });
            }
        });

        // Save merged cart to DB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { cartItems: mergedCart },
            { new: true }
        ).populate("cartItems.productId");

        res.json({ 
            success: true, 
            message: "Cart merged successfully",
            cartItems: updatedUser.cartItems
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};