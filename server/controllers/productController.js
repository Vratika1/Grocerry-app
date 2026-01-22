import {v2 as cloudinary} from "cloudinary";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { sendPriceDropEmail } from "../configs/email.js";


// add product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    if (!req.body.productData) {
      return res.json({ success: false, message: "productData is missing" });
    }

    const productData = JSON.parse(req.body.productData);

    if (!req.files || req.files.length === 0) {
      return res.json({ success: false, message: "At least one image is required" });
    }

    // upload images to cloudinary using buffer
    const imagesUrl = await Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "grocery-products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          ).end(file.buffer);
        });
      })
    );

     // split description string into array if it's a string
    let descriptionArray = [];
    if (productData.description) {
      if (typeof productData.description === "string") {
        descriptionArray = productData.description
          .split("\n")      // split by new line
          .map(str => str.trim())  // remove extra spaces
          .filter(Boolean); // remove empty strings
      } else if (Array.isArray(productData.description)) {
        descriptionArray = productData.description; // already array
      }
    }

    // save product
    const product = await Product.create({
      ...productData,
      description: descriptionArray,
      image: imagesUrl
    });

    res.json({ success: true, message: "Product Added", product });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// get product : /api/product/list
 
export const productList = async (req , res) => {
    try {
        
        const products = await Product.find({});
        res.json({success:true ,  products});

    } catch (error) {
        console.log(error.message);
        res.json({ success : false , message: error.message});
    }
}



// get single product : /api/product/id
 
export const productById = async (req , res) => {

    try {

        const {id }= req.body;

        const product = await Product.findById(id);
        res.json({success:true ,  product});

        
    } catch (error) {
        console.log(error.message);
        res.json({ success : false , message: error.message});
    }


}



//change product inStock : /api/product/stock
 
export const changeStock = async (req , res) => {

    try {
        const {id , inStock} = req.body;

        await Product.findByIdAndUpdate(id , {inStock});
        res.json({success:true ,  message: 'stock updated'});
        
    } catch (error) {
        console.log(error.message);
        res.json({ success : false , message: error.message});
    }

}


// update product : /api/product/update
export const updateProduct = async (req, res) => {
    try {
        const { id, name, description, category, price, offerPrice } = req.body;

        if (!id) {
            return res.json({ success: false, message: "Product ID is required" });
        }

        // Get current product to check price change
        const currentProduct = await Product.findById(id);
        if (!currentProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        const oldOfferPrice = currentProduct.offerPrice;
        const newOfferPrice = Number(offerPrice);

        // Prepare update data
        const updateData = {};
        if (name) updateData.name = name;
        if (category) updateData.category = category;
        if (price) updateData.price = Number(price);
        if (offerPrice) updateData.offerPrice = newOfferPrice;
        
        if (description) {
            if (typeof description === "string") {
                updateData.description = description
                    .split("\n")
                    .map(str => str.trim())
                    .filter(Boolean);
            } else if (Array.isArray(description)) {
                updateData.description = description;
            }
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        // Check if price decreased - send notifications
        if (newOfferPrice && newOfferPrice < oldOfferPrice) {
            // Find all users who have this product in their cart
            const usersWithProductInCart = await User.find({
                'cartItems.productId': id
            });

            // Send price drop email to each user (async, don't wait)
            usersWithProductInCart.forEach(async (user) => {
                try {
                    await sendPriceDropEmail(user, updatedProduct, oldOfferPrice, newOfferPrice);
                } catch (emailError) {
                    console.error(`Failed to send price drop email to ${user.email}:`, emailError.message);
                }
            });
        }

        res.json({ 
            success: true, 
            message: "Product updated successfully", 
            product: updatedProduct,
            priceDropNotificationsSent: newOfferPrice < oldOfferPrice ? true : false
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};