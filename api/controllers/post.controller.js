import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const post = async (req, res, next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403, "You are not allowed to create a post"));
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, "Title and Content required"));
    }
    const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "");
    const newPost = new Post({
        ...req.body,
        slug: slug,
        userId: req.user.userId,
    });
    try{
        const response = await newPost.save();
        if(response){
            res.status(201).json(response);
        }else{
            res.status(401).json({message: "Post not created"});
        }
    }catch(err){
        next(err);
    }
}