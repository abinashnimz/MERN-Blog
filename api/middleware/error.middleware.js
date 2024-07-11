export const errorMiddleware = (err, req, res, next)=>{
    const success = err.success || false;
    const status = err.statusCode || 500;
    const message = err.message || "BACKEND ERROR";

    return res.status(status).json({success, message})
}