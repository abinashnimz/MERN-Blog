import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    }
}, {timestamps:true});

//Middleware for Hashing Password
userSchema.pre("save", async function(next){
    try{
        let user = this;
        const saltRound = await bcrypt.genSalt(10);
        if(user.isModified("password")){
            user.password = await bcrypt.hash(user.password, saltRound);
        }
        next();
    }catch(err){
        next(err);
    }
})



const User = new mongoose.model("User", userSchema);

export default User;