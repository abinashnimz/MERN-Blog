export const error = async (req, res, next)=>{
    try{
        res.status(500).json({message: "Page not Found"});
    }catch(err){
        next(err);
    }
}