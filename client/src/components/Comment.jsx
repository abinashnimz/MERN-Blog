import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";


export const Comment = ({comment, onLike})=>{
    const [user, setUser] = useState({});
    const { currentUser } = useSelector((state)=> state.user);

    useEffect(()=>{
        const fetchUser = async()=>{
            const res = await fetch(`/api/user/${comment.userId}`)
            const data = await res.json();
            if(res.ok){
                setUser(data);
            }
        };
        fetchUser()
    }, [comment])

    return(
        <div className="flex p-4 border-b dark:border-gray-600 text-sm">
            <div className="flex-shrink-0 mr-3">
                <img src={user.profilePic} className="w-10 h-10 rounded-full bg-gray-200" alt={user.username}/>
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="font-bold mr-1 text-xs truncate">{user ? `@${user.username}` : "anonymous user"}</span>
                    <span className="text-gray-500 text-xs">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                <p className="text-gray-500 pb-2">{comment.content}</p>
                <div className="flex gap-1 items-center pt-2 text-sm border-t dark:border-gray-700 max-w-fit">
                    <button onClick={()=>onLike(comment._id)} type="button" className={`text-sm text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && "!text-blue-500"}`}>
                        <FaThumbsUp/>
                    </button>
                    <p className="text-gray-500">{comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "Like" : "Likes")}</p>
                </div>
            </div>
        </div>
    )
}