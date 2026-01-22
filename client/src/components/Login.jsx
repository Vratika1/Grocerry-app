import React from 'react'
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Login = () => {
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const {setShowUserLogin ,setUser , axios, navigate, setCartItems, cartItems} = useAppContext();

    const onSubmitHandler = async(event)=>{
       event.preventDefault();
        try {
            const { data } = await axios.post(`/api/user/${state}`, { name, email, password });
            
            if (data.success) {
                // Get localStorage cart before login clears it
                const localStorageCart = localStorage.getItem('guestCart');
                const guestCart = localStorageCart ? JSON.parse(localStorageCart) : [];
                
                // Also include current in-memory cart items (for guest users)
                const localCart = cartItems.length > 0 ? cartItems : guestCart;

                // Make sure cookie is set and verified
                const authRes = await axios.get('/api/user/is-auth', { withCredentials: true });

                if(authRes.data.success){
                    setUser(authRes.data.user);
                    
                    // Merge local cart with DB cart if there are local items
                    if (localCart && localCart.length > 0) {
                        try {
                            const mergeRes = await axios.post('/api/cart/merge', { 
                                localCartItems: localCart 
                            });
                            
                            if (mergeRes.data.success) {
                                // Normalize merged cart
                                const mergedCart = mergeRes.data.cartItems.map(item => ({
                                    productId: item.productId?._id || item.productId,
                                    quantity: Number(item.quantity) || 1
                                }));
                                setCartItems(mergedCart);
                                
                                // Clear guest cart from localStorage
                                localStorage.removeItem('guestCart');
                            }
                        } catch (mergeError) {
                            console.log("Cart merge failed:", mergeError.message);
                            // Fall back to DB cart
                            const dbCart = authRes.data.user.cartItems || [];
                            setCartItems(dbCart.map(item => ({
                                productId: item.productId?._id || item.productId,
                                quantity: Number(item.quantity) || 1
                            })));
                        }
                    } else {
                        // No local cart, use DB cart
                        const dbCart = authRes.data.user.cartItems || [];
                        setCartItems(dbCart.map(item => ({
                            productId: item.productId?._id || item.productId,
                            quantity: Number(item.quantity) || 1
                        })));
                    }
                    
                    setShowUserLogin(false);
                    navigate('/');
                } else {
                    toast.error("Authorization failed. Please try login again.");
                }
            } else {
                toast.error(data.message || "Something went wrong!");
            }

        } catch (error) {
              // Axios error handling
            const msg = error.response?.data?.message || error.message || "Network Error";
            toast.error(msg);
        }
    }
    

    return (

        <div onClick={()=>{ setShowUserLogin(false)}} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
            <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                </div>
                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                    </p>
                )}
                <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login
