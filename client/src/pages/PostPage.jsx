import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CallToAction } from "../components/CallToAction";
import { CommentSection } from "../components/CommentSection";




export const PostPage = () => {

    const { postSlug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(()=>{
        const fetchPost = async ()=>{
            try{
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`,{method:"GET"});
                const data = await res.json();
                if(!res.ok){
                    setLoading(false);
                    setError(true);
                    console.log(data.message);
                }
                if(res.ok){
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(false);
                }
            }catch(err){
                console.log(err);
                setLoading(false);
                setError(true);
            }
        }
        fetchPost();
    }, [postSlug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" />
            </div>
        )
    }

    if(post){
        return (
           <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{post.title}</h1>
                <Link to={`/search?category=${post.category}`} className="mt-5 self-center">
                    <Button color="gray" size="sm" pill>{post.category}</Button>
                </Link>
                <img src={post.image} alt={post.title} className="mt-10 p-3 max-h-[600px] w-full object-cover"/>
                <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="italic">{(post.content.length/500).toFixed(0)} mins read</span>
                </div>
                <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html: post.content}}></div>
                {/* <div className="max-w-4xl mx-auto w-full">
                    <CallToAction/>
                </div> */}
                <div>
                    <CallToAction/>
                </div>
                <CommentSection postId={post._id}/>
           </main> 
        )
    }
}