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





import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Loading = () => {
  const { navigate, setUser, setCartItems } = useAppContext();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const nextUrl = query.get('next') || 'my-orders';

  useEffect(() => {
    const refreshUser = async () => {
      try {
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
        console.log("Failed to refresh user:", error.message);
      } finally {
        // Navigate immediately after refresh
        navigate(`/${nextUrl.replace(/^\/+/, '')}`);
      }
    };

    refreshUser();
  }, [nextUrl, navigate, setUser, setCartItems]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
    </div>
  );
};

export default Loading;
