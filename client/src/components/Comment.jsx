import { useEffect, useState } from "react";
import moment from "moment";


export const Comment = ({comment})=>{
    const [user, setUser] = useState({});

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
            </div>
        </div>
    )
}