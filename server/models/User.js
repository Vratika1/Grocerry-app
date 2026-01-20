import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {type:String , required:true},
    email: {type:String, reuired:true, unique: true},
    password: {type:String , required:true},
    cartItems: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }],




},{minimize:false})

const User = mongoose.models.user || mongoose.model('user',userSchema);

export default User;
