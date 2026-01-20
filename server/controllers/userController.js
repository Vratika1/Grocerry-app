import User from "../models/User.js";
import bcrypt from 'bcrypt'
import  jwt from "jsonwebtoken";
import Product from "../models/Product.js";


// Register User : /api/user/register




export const register = async (req, res) =>{

    try {
        const {name, email,password} = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: 'missing details'})
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.json({success:false , message :"user already exist "} )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({name,email,password : hashedPassword} );


        const token = jwt.sign({id:user._id}, process.env.SECRET_KEY, {expiresIn:'7d'});

        // res.cookie('token', token,{
        //     httpOnly :true, // prevent the js to access cookie
        //     secure : process.env.NODE_ENV === 'production' , //use secure cookies in production
        //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //secure from csrf ptrotection
        //     maxAge: 7*24*60*60*1000, // cookie expiration time
        // })


        res.cookie('token', token, {
  httpOnly: true,
secure: process.env.NODE_ENV === 'production', // must be true in prod (HTTPS)
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


        return res.json({success:true ,  user: {
        email: user.email,
        name: user.name,
        cartItems: user.cartItems || []
    }})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message});
    }

}





// Login User : /api/user/login


export const login = async (req,res) =>{
    try {

        const {email,password} = req.body;

        if(!email || !password ){
            return res.json({success:false, message:'email and password are required'})
        }

        const user = await User.findOne({email});

        if(!user){
            return res.json({success:false, message:'invalid email or psassword'})
        }

        const ismatch = await bcrypt.compare(password , user.password);


        if(!ismatch){
            return res.json({success:false, message:'invalid email or password'})
        }
        
        const token = jwt.sign({id:user._id}, process.env.SECRET_KEY, {expiresIn:'7d'});

      res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // must be true in prod (HTTPS)
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


        return res.json({success:true ,  user: {
        email: user.email,
        name: user.name,
        cartItems: user.cartItems || []
    }})


    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message});
    }
}



// Check Auth : /api/user/is-auth


export const isAuth = async (req,res)=>{
    try {
        const userId = req.userId;

        // console.log("UserId in isAuth:", req.userId); // 👈 4

        const user = await User.findById(userId).populate("cartItems.productId").select("-password");

        // console.log("User from DB:", user); // 👈 5
        
        return res.json({success:true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message});
    }
}



// Logout user :/api/user/logout


// export const logout = async (req, res) =>{

//     try {
//         // res.clearCookie('token' , {
//         //     httpOnly: true,
//         //     secure: process.env.NODE_ENV === 'production' ,
//         //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//         // });


//         res.cookie('token', token, {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production', // must be true in prod (HTTPS)
//   sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin
//   maxAge: 7 * 24 * 60 * 60 * 1000,
// });


//         return res.json({success:true, message : "Logged Out"});

//     } catch (error) {
//         console.log(error.message)
//         res.json({success:false, message: error.message});
//     }

// }




export const logout = async (req, res) => {
    try {
        // Clear the cookie by setting it to empty and maxAge 0
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // must be true in prod (HTTPS)
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 0, // expire immediately
        });

        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


