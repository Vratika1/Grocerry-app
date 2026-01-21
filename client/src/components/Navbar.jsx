import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { assets} from '../assets/assets.js'
import { useAppContext } from '../context/AppContext.jsx' 
import { useState } from 'react'  
import toast from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = useState(false);
    
    const { user,setUser,navigate,axios, setShowUserLogin, setSearchQuery , searchQuery,getCartItemCount,setCartItems} = useAppContext();

    const logout = async () => {

        try {
            const {data} = await axios.post('/api/user/logout');
            if(data.success){
                toast.success(data.message);
                setUser(null);
                setCartItems([]);
                navigate('/');
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
       
    }


    useEffect(()=>{
        if(searchQuery.length>0){
            navigate('/products');
        }
    },[searchQuery])

    return (
        <>
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to='/' onClick={()=> setOpen(false)}>
                <img className="h-9" src={assets.logo} alt="Logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/products'>Products</NavLink>
                <NavLink to='/contact'>contact</NavLink>
              

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e)=> setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img className= "w-4 h-4 " src={assets.search_icon} alt="Search" />
                </div>

                <div className="relative cursor-pointer" onClick={()=>navigate('/cart')}>
                    <img className='w-6 opacity-80' src={assets.nav_cart_icon} alt="Cart" />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartItemCount()}</button>
                </div>

              {!user ?(   <button onClick={()=>{ setShowUserLogin(true)}}className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                    Login
                </button>):
                (
                    <div className='relative group'>
                     <img src={assets.profile_icon} alt="Profile" className="w-8 h-8 rounded-full cursor-pointer" />

                       {/* hover bridge */}
                        <div className="absolute top-8 right-0 h-4 w-full"></div>

                        
                     <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                        <li className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer' onClick={()=>{navigate('my-orders')}}>My Orders</li>
                        <li className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer' onClick={logout}>Logout</li>
                     </ul>
                    </div>
                )}
            </div>


            <div className='flex items-center gap-6 sm:hidden'>
                <div className="relative cursor-pointer" onClick={()=>navigate('/cart')}>
                    <img className='w-6 opacity-80' src={assets.nav_cart_icon} alt="Cart" />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartItemCount()}</button>
                </div>

                 <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" >
                {/* Menu Icon SVG */}
                <img className="w-6 h-6" src={assets.menu_icon} alt="Menu Icon" />
                </button>

            </div>
           
            {/* Mobile Menu */}
           
            {open && (
                <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`}>
                <NavLink to='/' onClick={()=> setOpen(false)}>Home</NavLink>
                <NavLink to='/products'  onClick={()=> setOpen(false)}>All Products</NavLink>
             
                {user &&  <NavLink to='/my-orders'  onClick={()=> setOpen(false)}>My Orders</NavLink>
                }
                <NavLink to='/contact'  onClick={()=> setOpen(false)}>contact</NavLink>

                {!user ? ( <button  onClick = {()=>{setOpen(false);
                    setShowUserLogin(true);
                }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                    Login
                </button>) : (
                     <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                    Logout
                </button>
                )}
               
            </div>)}

        </nav>
        </>
    )
}

export default Navbar
