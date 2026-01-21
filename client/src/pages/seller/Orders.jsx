import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext.jsx';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user');
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {myOrders.map((order) => (
        <div key={order._id} className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl">
          <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
            <span>OrderId: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>Total Amount: {currency}{order.amount}</span>
          </p>

          {order.items.map((item) => (
            <div
              key={item.product._id}
              className={`relative bg-white text-gray-500/70 ${order.items.length !== index + 1 ? "border-b" : ""} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <img
                    src={item.product.image?.[0] || '/placeholder.png'}
                    alt={item.product.name || 'Product'}
                    className="w-16 h-16"
                  />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-medium text-gray-800">{item.product.name}</h2>
                  <p>Category: {item.product.category}</p>
                </div>
              </div>

              <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                <p>Quantity: {item.quantity ?? 1}</p>
                <p>Status: {order.paymentStatus ?? (order.isPaid ? "Paid" : "Pending")}</p>
                <p>Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>

              <p className="text-primary text-lg font-medium">
                Amount: {currency}{(item.product.offerPrice ?? item.product.price ?? 0) * (item.quantity ?? 1)}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;










// import React, { useEffect } from 'react'
// import { useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { dummyOrders ,assets } from '../../assets/assets';
// import toast from 'react-hot-toast';

// const Orders = () => {
  
//   const {currency , axios} = useAppContext();

//   const [orders, setOrders] = useState([]); 

//   const fetchOrders = async () =>{
//     try {
//         const {data} = await axios.get('/api/order/seller');
//         if(data.success){
//             setOrders(data.orders);
//         }else{
//             toast.error(data.message);
//         }
//     } catch (error) {
//         toast.error(error.message);
//     }
//   }

//   useEffect(()=>{
//       fetchOrders();
//   },[])


//     return (

//       <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
//         <div className="md:p-10 p-4 space-y-4">
//             <h2 className="text-lg font-medium">Orders List</h2>
//             {orders.map((order, index) => (
//                 <div key={index} className="flex flex-col md:flex-row justify-between md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300">
//                     <div className="flex gap-5 max-w-80">
//                         <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
//                         <div>
//                             {order.items.map((item, index) => (
//                                 <div key={index} className="flex flex-col">
//                                     <p className="font-medium">
//                                         {item.product?.name || "Unknown Product"}{" "} <span className="text-primary"> x {item.quantity}</span>
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="text-sm md:text-base text-black/60">
//                         <p className='text-black/80'>{order.address.firstName} {order.address.lastName}
//                         </p>
//                         <p>{order.address.street}, {order.address.city}</p> 
//                         <p> {order.address.state}, {order.address.zipcode}, {order.address.country}</p>
//                         <p></p>
//                         <p>{order.address.phone}</p>
//                     </div>

//                     <p className="font-medium text-lg my-auto">{currency}{order.amount}</p>

//                     <div className="flex flex-col text-sm">
//                         <p>Method: {order.paymentType}</p>
//                         <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
//                         <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
//                     </div>
//                 </div>
//             ))}
//         </div>
//       </div>  
//     );
// }

// export default Orders
