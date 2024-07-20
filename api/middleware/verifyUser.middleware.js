import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";


export const verifyToken = async (req, res, next)=>{
    try{
        const token = await req.cookies.access_token;
        if(!token){
            return next(errorHandler(401, "Unauthorized"));
        }
        await jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
            if(err){
                return next(errorHandler(401, "Unauthorized"));
            }
            req.user = user;
            next();
        });
    }catch(err){
        next(err);
    }
};