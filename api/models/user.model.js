import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    },
    profilePic: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
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
});

//Middleware for Comparing Password for update user
// userSchema.methods.hashPassword = async function(password){
//     try{
//         const saltRound = await bcrypt.genSalt(10);
//         return await bcrypt.hash(password, saltRound);
//     }catch(err){
//         next(err);
//     }
// }

//Middleware for Comparing Password
userSchema.methods.comparePassword = async function(password){
    try{
        return bcrypt.compare(password, this.password);
    }catch(err){
        next(err);
    }
}

//Middleware for generating token
userSchema.methods.generateToken = async function(){
    try{
        return jwt.sign(
            {
                userId: this._id,
                email: this.email,
            },
            process.env.JWT_SECRET
        )
    }catch(err){
        next(err);
    }
}



const User = new mongoose.model("User", userSchema);

export default User;