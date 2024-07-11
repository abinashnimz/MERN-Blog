import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next)=>{
    try{
        const {username, email, password} = req.body;
        if(!username || !email || !password || username==="" || email==="" || password===""){
            next(errorHandler(400, "All fields are required"));
        }
        
        const userExist = await User.findOne({email:email});
        if(userExist){
            next(errorHandler(401, "User already exist"));
        }
        
        const newUser = new User({
            username,
            email,
            password
        })
        const response = await newUser.save()
        if(response){
            res.status(201).json({message:"Signup Successful"});
        }else{
            res.status(402).json({message:"Signup Failed"})
        }

    }catch(err){
        next(err);
    }
}