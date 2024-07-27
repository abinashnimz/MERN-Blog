import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next)=>{
    try{
        const { content, postId, userId } = req.body;
        if(userId !== req.user.userId){
            return next(errorHandler(403, "You are not allowed to comment"))
        }
        const newComment = new Comment({
            content,
            postId,
            userId,
        });
        await newComment.save();
        res.status(201).json(newComment);
    }catch(err){
        next(err);
    }

}

export const getComments = async (req, res, next)=>{
    try{
        const comments = await Comment.find({postId: req.params.postId}).sort({createdAt:-1});
        res.status(200).json(comments);

    }catch(err){
        next(err);
    }
}

export const likeComment = async (req, res, next)=>{
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404, "comment not found"));
        }
        const userIndex = comment.likes.indexOf(req.user.userId);
        console.log("userIndex", userIndex);
        if(userIndex === -1){
            comment.numberOfLikes +=1;
            comment.likes.push(req.user.userId);
        }else{
            comment.numberOfLikes -=1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        res.status(201).json(comment);
    }catch(err){
        next(err);
    }
}

export const editComment = async (req, res, next)=>{
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404, "Comment not found"));
        }
        if((comment.userId !== req.user.userId) && !req.user.isAdmin){
            return next(errorHandler(404, "You are not allowed to edit this comment"));
        }
        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
            content:req.body.content,
        }, {new:true});
        res.status(201).json(editedComment);
    }catch(err){
        next(err);
    }
}

export const deleteComment = async (req, res, next)=>{
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404, "Comment not found"));
        }
        if((comment.userId !== req.user.userId) && !req.user.isAdmin){
            return next(errorHandler(403, "You are not allowed to delete this comment"));
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(204).json("Comment deleted");
    }catch(err){
        next(err);
    }
}

export const getAllComments = async (req, res, next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403, "You are not allowed to do get the comments"));
    }
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const order = req.query.order === "asc" ? 1 : -1;
    const comments = await Comment.find().sort({createdAt:order}).skip(startIndex).limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth()-1, now.getDate());
    const lastMonthComments = await Comment.countDocuments({createdAt: {$gte:oneMonthAgo}});
    res.status(200).json({comments, totalComments, lastMonthComments})
}