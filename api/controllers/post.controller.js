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

export const getposts = async (req, res, next)=>{
    try{
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc"? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && {userId: req.query.userId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or:[
                    {title: {$regex: req.query.searchTerm, $options:"i"}},
                    {content: {$regex: req.query.searchTerm, $options:"i"}},
                ],
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate(),
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({
            posts, totalPosts, lastMonthPosts,
        })

    }catch(err){
        next(err);
    }
}

export const deletepost = async (req, res, next) =>{
    if(!req.user.isAdmin || req.user.userId !== req.params.userId){
        return next(403, "You are not allowed to delete this post");
    }
    try{
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json("Post has been deleted");
    }catch(err){
        next(err);
    }
}

export const updatepost = async (req, res, next)=>{
    if(!req.user.isAdmin || req.user.userId !== req.params.userId){
        return next(403, "You are not allowed to delete this post");
    }
    try{
        const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "");
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId, {
                $set:{
                    title: req.body.title,
                    category: req.body.category,
                    image: req.body.image,
                    content: req.body.content,
                    slug: slug,
                }
            }, {new:true}
        );
        res.status(201).json(updatedPost);
    }catch(err){
        next(err);
    }
}