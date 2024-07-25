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