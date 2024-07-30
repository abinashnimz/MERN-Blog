import { Link } from "react-router-dom";
import { CallToAction } from "../components/CallToAction";
import { useState, useEffect } from "react";
import { PostCard } from "../components/PostCard";


export const Home = ()=>{

    const [posts, setPosts] = useState([]);
    const [postError, setPostError] = useState(null);

    useEffect(()=>{
        const fetchPost = async ()=>{
            try{
                const res = await fetch(`/api/post/getposts`,{method:"GET"});
                const data = await res.json();
                if(!res.ok){
                    setPostError(data.message);
                }
                if(res.ok){
                    setPostError(null);
                    setPosts(data.posts);
                }
            }catch(err){
                console.log(err);
            }
        };
        fetchPost();
    }, []);

    return(
        <div>
            <div className="flex flex-col gap-6 p-28 px-6 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
                <p className="text-gray-500 text-xs sm:text-sm">Here you'll find a variety of articles and tutorials on topics such as
                web development, software engineering, and programming languages.</p>
                <Link to="/search" className="text-teal-500 font-bold hover:underline text-xs sm:text-sm ">View all posts</Link>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-slate-700">
                <CallToAction/>
            </div>
            <div className="max-w-[85rem] mx-auto p-3 flex flex-col gap-8 py-7">
                {posts && posts.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {posts.map((post, ind)=>(
                                <PostCard key={ind} post={post} />
                            ))}
                        </div>
                        <Link className="text-center text-lg text-teal-500 text-center hover:underline" to="/search">View all posts</Link>
                    </div>
                )}
            </div>
        </div>
    )
}