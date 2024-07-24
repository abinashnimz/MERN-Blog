import { Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


export const DashPosts = ()=>{
    const { currentUser } = useSelector((state)=> state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [getPostError, setGetPostError] = useState(null);
    console.log(currentUser);
    useEffect(()=>{
        const getPosts = async ()=>{
            try{
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();
                if(res.ok){
                    setUserPosts(data.posts)
                }
                if(!res.ok){
                    setGetPostError(data.message);
                }
            }catch(err){
                console.log(err);
                setGetPostError(err);
            }
        }
        if(currentUser.isAdmin){
            getPosts();
        }
    }, [currentUser._id]);
    console.log(userPosts);

    const handleShowMore = async ()=>{
        const startIndex = userPosts.length;
        try{
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json();
            if(res.ok){
                setUserPosts((prev)=> [...prev, ...data.posts]);
                if(data.posts.length<9){
                    setShowMore(false);
                }
            }
        }catch(err){
            console.log(err.message);
        }
    }

    return(
        <div className="p-3 table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && userPosts.length>0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell><span className="hidden md:block">Edit</span></Table.HeadCell>
                        </Table.Head>
                        {userPosts.map((post)=>(
                            <Table.Body className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img src={post.image} alt={post.slug} className="w-20 h-10 object-cover bg-gray-500"/>
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`} className="font-medium text-gray-900 dark:text-white">
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {post.category}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/update-post/${post._id}`}>
                                            <span className="font-medium text-teal-500 hover:underline">Edit</span>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button onClick={handleShowMore} className="w-full self-center text-teal-500 text-sm py-7">Show more</button>
                    )}
                </>
            ):(
                <p>You have no post</p>
            )}
        </div>
    )
}