import {v2 as cloudinary} from "cloudinary";
import Product from "../models/Product.js";
import Product from "../models/Product.js";

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

    // save product
    const product = await Product.create({
      ...productData,
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