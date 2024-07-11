import User from "../models/user.model.js";


export const signup = async (req, res)=>{
    try{
        const {username, email, password} = req.body;
        if(!username || !email || !password || username==="" || email==="" || password===""){
            return res.json({message:"All fields are required."});
        }
        
        const userExist = await User.findOne({email:email});
        if(userExist){
            return res.json({message:"User already Exist"});
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
        res.status(404).json({message:err.message})
    }
}