import { createContext, use, useContext,useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const currency = import.meta.env.VITE_CURRENCY;
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});
   




    //fetch seller status

    const fetchSeller = async () =>{
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true);
            }else{
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false);
            
        }
    }


    // fetch user auth status , user data and cart items

    const fetchUser = async () =>{
        try {

            const {data} = await axios.get('/api/user/is-auth');
            if(data.success){
                setUser(data.user);
                setCartItems(data.user.cartItems);
               
            }else{
                toast.error(data.message);
            }
            
        } catch (error) {
            setUser(null);
        }
    }


    // fetch products
    const fetchProducts = async () => {
        // setProducts(dummyProducts);

        try {
            const {data} = await axios.get('/api/product/list');
            if(data.success){
                setProducts(data.products);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(data.message);

        }
    }



    // add product t0 cart

    const addToCart = (itemId) => {
    
        // let cartData = structuredClone(cartItems);

        // if(cartData[itemId]){
        //     cartData[itemId] += 1;
        // }else{
        //     cartData[itemId] = 1;
        // }
        // setCartItems(cartData);

        // toast.success("added to cart")


         let cartData = [...cartItems]; // copy array

    const existingItem = cartData.find(item => item._id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartData.push({ _id: itemId, quantity: 1 });
    }

    setCartItems(cartData);
    toast.success("Added to cart");



    }

    // updaate cart item quantity

    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("cart updated");
    }    


    // remove product from cart

    const removeFromCart = (itemId) => {


        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] <= 0) {
                delete cartData[itemId];   // remove from cart completely
            }
            setCartItems(cartData);
            toast.success("Removed from cart");
        }

    }


    // get cart item count 

    const getCartItemCount = () => {
        // let totalCount = 0;
        // for(const item in cartItems){
        //     totalCount += cartItems[item];
        // }
        // return totalCount;


        if (!cartItems || cartItems.length === 0) return 0;

    return cartItems.reduce((total, item) => {
        return total + (item.quantity || 0);
    }, 0);
    }

    // get cart total amount

    const getCartTotalAmount = () => {

        let totalAmount = 0;

        if (!products || !cartItems) return totalAmount;

        for (const productId in cartItems) {
            const product = products.find(p => p._id === productId);

            // Skip if product not found or quantity <= 0
            if (!product || cartItems[productId] <= 0) continue;

            totalAmount += product.offerPrice * cartItems[productId];
        }

        // Round to 2 decimal places
        return Math.floor(totalAmount * 100) / 100;

    }


    useEffect(()=>{
        fetchProducts();
        fetchSeller();
        fetchUser();
    },[])


    // update database cart items when cartItems change
    useEffect(()=>{
        const updateCartInDB = async () => {
            try {
                const {data} = await axios.post('/api/cart/update',{cartItems});
                if(!data.success){
                    toast.error(data.message || "Failed to update cart");
                }
            } catch (error) {
                toast.error(error.message || "error Failed to update cart");
            }
        }

        if(user){
            updateCartInDB();
        }
    },[cartItems ])




    const value = {navigate, user, setUser,searchQuery,setSearchQuery, isSeller, getCartItemCount,getCartTotalAmount, setIsSeller , showUserLogin, setShowUserLogin,products,currency, addToCart ,updateCartItem , removeFromCart, cartItems , axios , fetchProducts , setCartItems};


    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export  const useAppContext = () => {
    return useContext(AppContext);
}