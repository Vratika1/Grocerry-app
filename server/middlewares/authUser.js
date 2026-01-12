import jwt from 'jsonwebtoken';

const authUser = async (req , res, next) => {
    // console.log("Cookies:", req.cookies);   // 👈 1
    const {token} = req.cookies;

    if(!token){
        return res.json({success: false, message: 'Not Authorized '});
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.SECRET_KEY);
        // console.log("Decoded Token:", tokenDecode);

        if(tokenDecode.id){
            req.userId = tokenDecode.id;
            // console.log("UserId set in req:", req.userId);
        }else{
            return res.json({success: false, message: 'Not Authorized '});

        }

        next();

    } catch (error) {
        return res.json({success: false, message: error.message});
    }

}

export default authUser;