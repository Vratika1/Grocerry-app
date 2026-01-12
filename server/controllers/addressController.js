

import Address from "../models/Address.js";


// Add Address : /api/addresss/add
export const addAddress = async(req , res ) =>{
    try {
       const { address} = req.body;
       const userId = req.userId;

       
        if (!userId) {
        return res.json({ success: false, message: "Unauthorized" });
        }
       
        await Address.create({...address, userId});
       
        res.json({ success : true, message: ' Address added successfully '});

    } catch (error) {
        console.log(error.message);
        res.json({ success : false , message: error.message});
    }
}



// get address : /api/address/list

export const getAddress = async(req , res ) =>{

    try {

        const userId = req.userId;

        const addresses = await Address.find({userId});

        res.json({ success : true, addresses});
        
    } catch (error) {

        console.log(error.message);
        res.json({ success : false , message: error.message});
        
    }
}

