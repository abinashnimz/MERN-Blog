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

export const signin = async (req, res, next)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password || email==="" || password===""){
            return next(errorHandler(400, "All fields are required"));
        }
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(400, "Invalid Credentials"));
        }
        const isPassValid = await validUser.comparePassword(password);
        if(!isPassValid){
            return next(errorHandler(400, "Invalid Credentials"));
        }
        const token = await validUser.generateToken();
        const { password:pass, ...userdata } = validUser._doc;
        res.status(200).cookie("access_token", token,{
            httpOnly:true,
        }).json({userdata, token:token});

    }catch(err){
        next(err);
    }
}

export const google = async(req, res, next)=>{
    const { name, email, googlePhotoUrl } = req.body;
    try{
        const userExist = await User.findOne({email});
        if(userExist){
            const token = await userExist.generateToken();
            const { password:pass, ...userdata } = userExist._doc;
            res.status(200).cookie("access_token", token,{
                httpOnly:true,
            }).json({userdata, token:token});
        }else{
            const randomPassword = Math.random().toString(36).slice(-8);
            const newUser = new User({
                username: name.split(" ").join("").toLocaleLowerCase()+Math.random().toString(9).slice(-4),
                email: email,
                password: randomPassword,
                profilePic: googlePhotoUrl,
            });
            const response = await newUser.save();
            const token = await newUser.generateToken();
            const { password, ...userData } = newUser._doc;
            if(response){
                res.status(201).cookie("access_token", token).json({userData, token:token});
            }else{
                res.status(402).json({message:"Signup Failed"})
            }
        }
    }catch(err){
        next(err);
    }
}