import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();
const DB = process.env.MONGODB_URI;

const fixDescriptions = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Database connected");

    const products = await Product.find();
    let updatedCount = 0;

   for (let product of products) {
  if (product.description && product.description.length > 0) {
    const newDesc = product.description.flatMap(desc => {
      if (typeof desc === "string") {
        return desc
          .replace(/\\n/g, ',')   // replace \n with comma
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      }
      return Array.isArray(desc) ? desc : [desc];
    });

    // Only save if actually changed
    if (JSON.stringify(product.description) !== JSON.stringify(newDesc)) {
      product.description = newDesc;
      await product.save();
      updatedCount++;
    }
  }
}


    console.log(`Updated ${updatedCount} products`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixDescriptions();
