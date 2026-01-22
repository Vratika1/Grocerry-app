// import React from 'react'
// import { useAppContext } from '../context/AppContext'
// import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';

// const Loading = () => {

//     const { navigate} = useAppContext();

//     let { search} = useLocation();
//     const query = new URLSearchParams(search);

//     const nextUrl = query.get('next');

//     useEffect(() =>{
//         if(nextUrl){
//             setTimeout(() =>{
//                 navigate(`/${nextUrl}`);
//             },5000);
//         }
//     },[nextUrl]);

//   return (
//     <div className='flex justify-center items-center h-screen'>
//         <div className='animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary'></div>
//     </div>
//   )
// }

// export default Loading





import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const Loading = () => {
  const { navigate, setUser, setCartItems, axios } = useAppContext();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const nextUrl = query.get('next') || 'my-orders';
  const sessionId = query.get('session_id');
  const orderId = query.get('order_id');
  const [message, setMessage] = useState('Processing...');

  useEffect(() => {
    const verifyAndRedirect = async () => {
      try {
        // If coming from Stripe, verify payment first
        if (sessionId && orderId) {
          setMessage('Verifying payment...');
          // console.log("🔍 Verifying Stripe payment:", { sessionId, orderId });
          
          const { data } = await axios.post('/api/order/verify-stripe', {
            sessionId,
            orderId
          });
          
          // console.log("✅ Verification result:", data);
          
          if (data.success && data.isPaid) {
            setMessage('Payment successful! Redirecting...');
          } else {
            setMessage('Payment verification pending...');
          }
        }

        // Refetch user to update cart after Stripe checkout
        const { data } = await axios.get('/api/user/is-auth');
        if (data.success && data.user) {
          setUser(data.user);

          // Normalize cart
          const normalizedCart = Array.isArray(data.user.cartItems)
            ? data.user.cartItems.map(item => ({
                productId: item.productId || item._id,
                quantity: Number(item.quantity) || 1
              }))
            : [];
          setCartItems(normalizedCart);
        }
      } catch (error) {
        // console.log("Failed to verify/refresh:", error.message);
        setMessage('Error processing. Redirecting...');
      } finally {
        // Short delay then navigate
        setTimeout(() => {
          navigate(`/${nextUrl.replace(/^\/+/, '')}`);
        }, 1000);
      }
    };

    verifyAndRedirect();
  }, [sessionId, orderId, nextUrl, navigate, setUser, setCartItems, axios]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;
