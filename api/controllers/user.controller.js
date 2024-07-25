import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import bcrypt from "bcryptjs";

export const testuser = (req, res)=>{
    res.json({message:"Test user successful"})
}

export const updateUser = async (req, res, next)=>{
    if(req.user.userId !== req.params.userId){
        return next(errorHandler(403, "You are not allowed to update this user"));
    }
    if(req.body.password){
        if(req.body.password.length<5){
            return next(errorHandler(400, "password must be atleast 5 characters"));
        }
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    if(req.body.username){
        if(req.body.username.length <3 || req.body.username>20){
            return next(errorHandler(400, "Username must be between 3-20"));
        }
        if(req.body.username.includes(" ")){
            return next(errorHandler(400, "Username cannot contain spaces"));
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400, "Username must be lowercase"));
        }
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set:{
                    username: req.body.username,
                    email: req.body.email,
                    profilePic: req.body.profilePic,
                    password:req.body.password
                },
            },
            { new:true }
        );
        const { password, ...userdata } = updatedUser._doc;
        res.status(201).json(userdata);
    }catch(err){
        next(err);
    }
};

export const deleteUser = async (req, res, next)=>{
    if(!req.user.isAdmin && req.user.userId !== req.params.userId){
        return next(errorHandler(403, "You are not allowed to delete this user"));
    }
    try{
        const data = await User.findByIdAndDelete({_id:req.params.userId});
        if(!data){
            return next(errorHandler(500, "Something went wrong"));
        }
        res.status(202).json("User deleted successfully");
    }catch(err){
        next(err);
    }
}

export const signoutUser = async (req, res, next)=>{
    try{
       await res.clearCookie("access_token").status(200).json("User signout successfully");
    }catch(err){
        next(err);
    }
}

export const getUsers = async (req, res, next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403, "You are not allowed to get users"));
    }
    try{
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;

        const users = await User.find()
        .sort({createdAt: sortDirection})
        .skip(startIndex)
        .limit(limit);

        const usersWithoutPassword = users.map((user)=>{
            const {password, ...rest} = user._doc;
            return rest;
        })

        const totalUsers = await User.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        )
        const lastMonthUsers = await User.countDocuments({
            createdAt: {$gte: oneMonthAgo}
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers: totalUsers,
            lastMonthUsers: lastMonthUsers,
        })
        
    }catch(err){
        next(err);
    }
}