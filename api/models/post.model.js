import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId : {
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
        unique:true,
    },
    category:{
        type: String,
        required:true,
        default: "uncategorized",
    },
    image:{
        type: String,
        default: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    content:{
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    }
}, {timestamps:true});

const Post = new mongoose.model("Post", postSchema);
export default Post;