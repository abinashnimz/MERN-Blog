const validator = (schema)=> async(req, res, next)=>{
    try{
        console.log("Validator working");
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    }catch(err){
        console.log(err);
        const error = {
            status : 422,
            message : err.errors[0].message
        };
        next(error);
    }
}
export default validator;