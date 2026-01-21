// import mongoose from 'mongoose';


// const orderSchema = new mongoose.Schema({

//     userId: { type: String , required : true, ref: 'user'},
//     items: [{
//         product : { type: String , required : true, ref: 'product'},
//         quantity : { type: Number , required : true}
//     }],
//     amount : { type: Number , required : true},
//     address : { type: String , required : true , ref : 'address'},
//     status : { type: String , default : 'Order Placed'},
//     paymentType : { type: String , required : true},
//     isPaid : { type: Boolean , required : true , default : false},
// }, { timestamps: true})


// const Order = mongoose.models.order || mongoose.model('order', orderSchema);

// export default Order;




import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
      },
      quantity: { type: Number, required: true }
    }
  ],

  amount: { type: Number, required: true },

  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "address",
    required: true
  },

  status: { type: String, default: "Order Placed" },
  paymentType: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  paymentStatus: { type: String, default: "Pending" }
},
{ timestamps: true }
);

const Order = mongoose.models.order || mongoose.model("order", orderSchema);
export default Order;
