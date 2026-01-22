// import { createContext, use, useContext,useEffect,useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { dummyProducts } from "../assets/assets";
// import toast from "react-hot-toast";
// import axios from 'axios';

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// export const AppContext = createContext();
// export const AppContextProvider = ({ children }) => {

//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [isSeller, setIsSeller] = useState(false);
//     const [showUserLogin, setShowUserLogin] = useState(false);
//     const [products, setProducts] = useState([]);
//     const currency = import.meta.env.VITE_CURRENCY;
//     const [cartItems, setCartItems] = useState([]);
//     const [searchQuery, setSearchQuery] = useState({});
   




//     //fetch seller status

//     const fetchSeller = async () =>{
//         try {
//             const {data} = await axios.get('/api/seller/is-auth');
//             if(data.success){
//                 setIsSeller(true);
//             }else{
//                 setIsSeller(false);
//             }
//         } catch (error) {
//             setIsSeller(false);
            
//         }
//     }


//     // fetch user auth status , user data and cart items

//     const fetchUser = async () => {
//     try {
//         const { data } = await axios.get('/api/user/is-auth');
//         console.log("fetchUser data:", data);

//         if (data.success && data.user) {
//             setUser(data.user);

//             const normalizedCart = Array.isArray(data.user.cartItems)
//                 ? data.user.cartItems.map(item => ({
//                     productId: item.productId || item._id,
//                     quantity: Number(item.quantity) || 1
//                 }))
//                 : [];

//             setCartItems(normalizedCart);
//         } else {
//             setUser(null);
//             setCartItems([]);
//         }
//     } catch (error) {
//         console.log("fetchUser error:", error.message);
//         setUser(null);
//         setCartItems([]);
//     }
// };



//     // const fetchUser = async () =>{
//     //     try {

//     //         const {data} = await axios.get('/api/user/is-auth');

//     //         console.log("fetchUser data:", data);
//     //         if(data.success){

//     //               console.log("User cartItems from backend:", data.user.cartItems);

//     //             setUser(data.user);
//     //            setCartItems(Array.isArray(data.user.cartItems) ? data.user.cartItems : []);
               
//     //         }else{

                 
//     //             toast.error(data.message);
//     //              setCartItems([]);
//     //         }
            
//     //     } catch (error) {
//     //         console.log("fetchUser error:", error.message);
//     //         setUser(null);
//     //          setCartItems([]);
//     //     }
//     // }


//     // fetch products
//     const fetchProducts = async () => {
//         // setProducts(dummyProducts);

//         try {
//             const {data} = await axios.get('/api/product/list');
//             if(data.success){
//                 setProducts(data.products);
//             }else{
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(data.message);

//         }
//     }



//     // add product t0 cart

//     const addToCart = (itemId) => {
    
//         // let cartData = structuredClone(cartItems);

//         // if(cartData[itemId]){
//         //     cartData[itemId] += 1;
//         // }else{
//         //     cartData[itemId] = 1;
//         // }
//         // setCartItems(cartData);

//         // toast.success("added to cart")


//     //      let cartData = [...cartItems]; 
//     // const existingItem = cartData.find(item => item.productId === itemId);
//     // if (existingItem) {
//     //     existingItem.quantity += 1;
//     // } else {
//     //     cartData.push({ productId: itemId, quantity: 1 }); // ✅ use productId
//     // }
//     // setCartItems(cartData);
//     // toast.success("Added to cart");



//      setCartItems(prev => {
//         const existing = prev.find(
//             item => String(item.productId) === String(productId)
//         );

//         if (existing) {
//             return prev.map(item =>
//                 String(item.productId) === String(productId)
//                     ? { ...item, quantity: item.quantity + 1 }
//                     : item
//             );
//         }

//         return [...prev, { productId, quantity: 1 }];
//     });

//     toast.success("Added to cart");



//     }

//     // updaate cart item quantity

//     const updateCartItem = (itemId, quantity) => {
//         // let cartData = structuredClone(cartItems);
//         // cartData[itemId] = quantity;
//         // setCartItems(cartData);
//         // toast.success("cart updated");

//  let cartData = [...cartItems];
//     const index = cartData.findIndex(item => item.productId === itemId);
//     if (index !== -1) {
//         cartData[index].quantity = quantity;
//     }
//     setCartItems(cartData);
//     toast.success("Cart updated");

//     }    


//     // remove product from cart

//     const removeFromCart = (itemId) => {


//         // let cartData = structuredClone(cartItems);
//         // if (cartData[itemId]) {
//         //     cartData[itemId] -= 1;
//         //     if (cartData[itemId] <= 0) {
//         //         delete cartData[itemId];   // remove from cart completely
//         //     }
//         //     setCartItems(cartData);
//         //     toast.success("Removed from cart");
//         // }



//       let cartData = [...cartItems];
//     const index = cartData.findIndex(item => item.productId === itemId);
//     if (index !== -1) {
//         cartData[index].quantity -= 1;
//         if (cartData[index].quantity <= 0) {
//             cartData.splice(index, 1); // remove completely
//         }
//     }
//     setCartItems(cartData);
//     toast.success("Removed from cart");


//     }


//     // get cart item count 

//     const getCartItemCount = () => {
//         // let totalCount = 0;
//         // for(const item in cartItems){
//         //     totalCount += cartItems[item];
//         // }
//         // return totalCount;


//         if (!cartItems || !Array.isArray(cartItems)) return 0;

//     return cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
//     }

//     // get cart total amount

//     const getCartTotalAmount = () => {

//         // let totalAmount = 0;

//         // if (!products || !cartItems) return totalAmount;

//         // for (const productId in cartItems) {
//         //     const product = products.find(p => p._id === productId);

//         //     // Skip if product not found or quantity <= 0
//         //     if (!product || cartItems[productId] <= 0) continue;

//         //     totalAmount += product.offerPrice * cartItems[productId];
//         // }

//         // // Round to 2 decimal places
//         // return Math.floor(totalAmount * 100) / 100;

// //   if (!cartItems || !products.length) return 0;

// //     const total = cartItems.reduce((sum, item) => {
// //         const product = products.find(p => p._id === item.productId);
// //         if (!product) {
// //             console.log("Product not found for total calculation:", item);
// //             return sum;
// //         }
// //         return sum + product.offerPrice * item.quantity;
// //     }, 0);

// //     console.log("Cart total amount:", total);
// //     return total;



//  if (!products.length || !cartItems.length) return 0;

//     return cartItems.reduce((total, item) => {
//         const product = products.find(
//             p => String(p._id) === String(item.productId)
//         );
//         if (!product) return total;
//         return total + product.offerPrice * item.quantity;
//     }, 0);

    

//     }


//     useEffect(()=>{
//         fetchProducts();
//         fetchSeller();
//         fetchUser();
//     },[])


//     // update database cart items when cartItems change
//     useEffect(()=>{
//         const updateCartInDB = async () => {
//             try {
//                 const {data} = await axios.post('/api/cart/update',{cartItems});
//                 if(!data.success){
//                     toast.error(data.message || "Failed to update cart");
//                 }
//             } catch (error) {
//                 toast.error(error.message || "error Failed to update cart");
//             }
//         }

//         if(user){
//             updateCartInDB();
//         }
//     },[cartItems ])




//     const value = {navigate, user, setUser,searchQuery,setSearchQuery, isSeller, getCartItemCount,getCartTotalAmount, setIsSeller , showUserLogin, setShowUserLogin,products,currency, addToCart ,updateCartItem , removeFromCart, cartItems , axios , fetchProducts , setCartItems};


//     return <AppContext.Provider value={value}>
//         {children}
//     </AppContext.Provider>
// }

// export  const useAppContext = () => {
//     return useContext(AppContext);
// }





import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);

    const currency = import.meta.env.VITE_CURRENCY;

    /* ================= SELLER ================= */
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get("/api/seller/is-auth");
            setIsSeller(!!data.success);
        } catch {
            setIsSeller(false);
        }
    };

    /* ================= USER ================= */
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/is-auth");

            if (data.success && data.user) {
                setUser(data.user);

                // NORMALIZE CART from DB
                const normalizedCart = Array.isArray(data.user.cartItems)
                    ? data.user.cartItems.map(item => ({
                          productId: item.productId?._id || item.productId,
                          quantity: Number(item.quantity) || 1
                      }))
                    : [];

                setCartItems(normalizedCart);
            } else {
                setUser(null);
                // Load guest cart from localStorage
                const guestCart = localStorage.getItem('guestCart');
                if (guestCart) {
                    try {
                        setCartItems(JSON.parse(guestCart));
                    } catch {
                        setCartItems([]);
                    }
                } else {
                    setCartItems([]);
                }
            }
        } catch (error) {
            setUser(null);
            // Load guest cart from localStorage
            const guestCart = localStorage.getItem('guestCart');
            if (guestCart) {
                try {
                    setCartItems(JSON.parse(guestCart));
                } catch {
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
            }
        }
        setIsInitialized(true);
    };

    /* ================= PRODUCTS ================= */
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/product/list");
            if (data.success) setProducts(data.products);
            else toast.error(data.message);
        } catch (error) {
            toast.error("Failed to load products");
        }
    };

    /* ================= CART ================= */

    // ✅ FIXED addToCart
    const addToCart = (itemId) => {
        console.log("🛒 addToCart:", itemId);

        setCartItems(prev => {
            const existing = prev.find(
                item => String(item.productId) === String(itemId)
            );

            if (existing) {
                return prev.map(item =>
                    String(item.productId) === String(itemId)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, { productId: itemId, quantity: 1 }];
        });

        toast.success("Added to cart");
    };

    const updateCartItem = (itemId, quantity) => {
        setCartItems(prev =>
            prev.map(item =>
                String(item.productId) === String(itemId)
                    ? { ...item, quantity }
                    : item
            )
        );
        toast.success("Cart updated");
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev =>
            prev
                .map(item =>
                    String(item.productId) === String(itemId)
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
        toast.success("Removed from cart");
    };

    const getCartItemCount = () => {
        if (!Array.isArray(cartItems)) return 0;
        return cartItems.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        );
    };

    const getCartTotalAmount = () => {
        if (!products.length || !cartItems.length) return 0;

        return cartItems.reduce((total, item) => {
            const product = products.find(
                p => String(p._id) === String(item.productId)
            );
            if (!product) return total;
            return total + product.offerPrice * item.quantity;
        }, 0);
    };

    /* ================= EFFECTS ================= */

    useEffect(() => {
        fetchProducts();
        fetchSeller();
        fetchUser();
    }, []);

    // Sync cart: to DB for logged-in users, to localStorage for guests
    useEffect(() => {
        // Wait for initialization to avoid overwriting
        if (!isInitialized) return;

        if (user) {
            // Logged-in user: sync cart to MongoDB
            const syncCartToDB = async () => {
                try {
                    await axios.post("/api/cart/update", { cartItems });
                } catch (error) {
                    console.log("Cart sync to DB failed:", error.message);
                }
            };
            syncCartToDB();
        } else {
            // Guest user: sync cart to localStorage
            if (cartItems.length > 0) {
                localStorage.setItem('guestCart', JSON.stringify(cartItems));
            }
        }
    }, [cartItems, user, isInitialized]);

    /* ================= CONTEXT ================= */
    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        cartItems,
        setCartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        getCartItemCount,
        getCartTotalAmount,
        searchQuery,
        setSearchQuery,
        axios,
        fetchProducts
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
