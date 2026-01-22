import { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { assets} from '../assets/assets';
import toast from 'react-hot-toast';

const Cart = () => {
   
    
   const {products, currency, cartItems, removeFromCart , getCartItemCount, updateCartItem, navigate,getCartTotalAmount , axios, user, setCartItems} = useAppContext();

    const [cartArray , setCartArray] = useState([]);
    const [addresses , setAddresses] = useState([]);
    const [showAddress , setShowAddress] = useState(false);
    const [selectedAddress , setSelectedAddress] = useState(null);
    const [paymentMethod , setPaymentMethod] = useState('COD');


    const getCart = () =>{


//          if (!products.length || !cartItems){
//             console.log("Product not found for item:", item);
//             return;
//          } 

//           console.log("cartItems in getCart:", cartItems);
//     console.log("products in getCart:", products);

//     // const tempArray = Object.keys(cartItems).map((key) => {
//     //     const product = products.find((p) => p._id === key);
//     //     if (product) {
//     //         return {
//     //             product,
//     //             quantity: cartItems[key],   // always get quantity from cartItems
//     //             productId: key
//     //         };
//     //     }
//     //     return null;
//     // }).filter(Boolean);

//     // setCartArray(tempArray);



//     const tempArray = cartItems.map((item) => {
//     const product = products.find((p) => p._id === item.productId);
//     if (!product) return null;
//     return {
//         product,
//         quantity: item.quantity,
//         productId: item.productId
//     };
// }).filter(Boolean);

//     console.log("tempArray for cart display:", tempArray);
// setCartArray(tempArray);




 if (!products.length || !Array.isArray(cartItems)) return;

    const tempArray = cartItems.map(item => {
        const product = products.find(
            p => String(p._id) === String(item.productId)
        );

        if (!product) {
            console.log("❌ Product not found:", item.productId);
            return null;
        }

        return {
            product,
            quantity: item.quantity,
            productId: item.productId
        };
    }).filter(Boolean);

    setCartArray(tempArray);

    }

    const getUserAddress = async() => {
        try {
            const {data} = await axios.get('/api/address/get');
            if(data.success){
                setAddresses(data.addresses);
                if(data.addresses.length>0){
                    setSelectedAddress(data.addresses[0]);
                }
                // No toast - we'll show "Add Address" button instead
            }
        } catch (error) {
            // Silent fail - user can add address
        }
    }

    const placeOrder = async () => {
    if (!user) return toast.error("Please login to place order");
    if (!selectedAddress) return toast.error("Please select an address");
    if (!cartArray.length) return toast.error("Your cart is empty");

        try {
            if (paymentMethod === 'COD') {
                const { data } = await axios.post("/api/order/cod", {
                    userId: user._id,
                    items: cartArray.map(item => ({
                        product: item.product._id,  // backend expects `product`
                        quantity: item.quantity
                    })),
                    address: selectedAddress._id
                });

                if (data.success) {
                    toast.success(data.message || "Order placed successfully");
                    setCartItems([]);  // clear cart
                    navigate("/my-orders");
                } else {
                    toast.error(data.message || "Failed to place order");
                }
            }
            else {
                // Online Payment (Stripe)
                try {
                    const { data } = await axios.post("/api/order/stripe", {
                        userId: user._id,
                        items: cartArray.map(item => ({
                            product: item.product._id,  // backend expects `product`
                            quantity: item.quantity
                        })),
                        address: selectedAddress._id
                    });

                    if (data.success) {
                        window.location.replace(data.url);
                        setCartItems([]);  // clear cart
                    } else {
                        // Show backend error in toast
                        toast.error(data.message || "Stripe payment failed");
                    }
                } catch (error) {
                    // Show axios / network errors in toast
                    toast.error(error.response?.data?.message || error.message || "Something went wrong");
                }
            }

            } catch (error) {
                toast.error(error.message || "Failed to place order");
            }
        };


        const subtotal = Object.keys(cartItems).reduce((total, id) => {
            const product = products.find(p => p._id === id);
            if (!product) return total;
            return total + product.offerPrice * cartItems[id];
        }, 0);



    useEffect(()=>{
        if(products.length>0 && cartItems){
            getCart();
        }
    },[products, cartItems]);


    useEffect(()=>{
        getUserAddress();
    },[user]);


    return products.length>0 && cartItems ?(


        <div className="flex flex-col md:flex-row mt-16">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartItemCount()}</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>


            {cartArray.map((item) => (

                <div key={item.productId} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                    <div className="flex items-center md:gap-6 gap-3">
                    <div
                        onClick={() => {
                        navigate(`/products/${item.product.category.toLowerCase()}/${item.product._id}`);
                        scrollTo(0, 0);
                        }}
                        className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
                    >
                        <img
                        className="max-w-full h-full object-cover"
                        src={item.product?.image?.[0] || '/placeholder.png'}
                        alt={item.product?.name || 'Product'}
                        />
                    </div>
                    <div>
                        <p className="hidden md:block font-semibold">{item.product.name}</p>
                        <div className="font-normal text-gray-500/70">
                        {item.product.weight && <p>Weight: <span>{item.product.weight}</span></p>}
                        <div className='flex items-center'>
                            <p>Qty:</p>
                            {/* <select
                            onChange={(e) => updateCartItem(item.productId, Number(e.target.value))}
                           value={cartItems.find(i => i.productId === item.productId)?.quantity || 1}

                            className='outline-none'
                            >
                            {Array(Math.max(cartItems.find(i => i.productId === item.productId)?.quantity || 1, 9))
                                .fill('')
                                .map((_, idx) => (
                                    <option key={idx} value={idx + 1}>{idx + 1}</option>
                                ))}


                            </select> */}
                            <select
    onChange={(e) => updateCartItem(item.productId, Number(e.target.value))}
    value={cartItems.find(i => i.productId === item.productId)?.quantity || 1}
    className='outline-none'
>
    {Array(9).fill('').map((_, idx) => (
        <option key={idx} value={idx + 1}>{idx + 1}</option>
    ))}
</select>

                        </div>
                        </div>
                    </div>
                    </div>

                    {/* Subtotal for this product */}
                    {/* <p className="text-center">{currency}{item.product.offerPrice * cartItems[item.productId]}</p> */}

                    <p className="text-center">{currency}{item.product.offerPrice * item.quantity}</p>


                    {/* Remove button */}
                    <button onClick={() => removeFromCart(item.productId)} className="cursor-pointer mx-auto">
                    <img src={assets.remove_icon} alt="remove" className='inline-block w-6 h-6' />
                    </button>
                </div>
                ))}


                <button onClick={() => {navigate('/products'); scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img src={assets.arrow_right_icon_colored} alt="arrow" className='group-hover:translate-x-1 transition' />
                    Continue Shopping
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street},${selectedAddress.city},${selectedAddress.state},${selectedAddress.country}`:"No address found"}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                               { addresses.map((address, index) => (<p onClick={() => {setSelectedAddress(address); setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100">
                                    {address.street}, {address.city}, {address.state}, {address.country}
                                </p>)) }
                                <p onClick={() => navigate('/add-address')} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>{currency}{getCartTotalAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>{currency}{getCartTotalAmount()*2/100}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>{currency}{getCartTotalAmount() + (getCartTotalAmount()*2/100)}</span>
                    </p>
                </div>

                {addresses.length === 0 ? (
                    <button 
                        onClick={() => navigate('/add-address?redirect=cart')} 
                        className="w-full py-3 mt-6 cursor-pointer bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
                    >
                        Add Address to Continue
                    </button>
                ) : (
                    <button 
                        onClick={() => {placeOrder()}} 
                        className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition"
                    >
                        {paymentMethod === 'COD' ? 'Place Order' : 'Proceed to Pay'}
                    </button>
                )}
            </div>
        </div>
    ) : null;
}

export default Cart
