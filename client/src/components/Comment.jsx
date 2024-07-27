import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";


export const Comment = ({ comment, onLike, onEdit, onDelete }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [user, setUser] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`/api/user/${comment.userId}`)
            const data = await res.json();
            if (res.ok) {
                setUser(data);
            }
        };
        fetchUser()
    }, [comment]);

    const handleEdit = async () => {
        if (!currentUser) {
            navigate("/sign-in");
            return;
        }
        try {
            setIsEdit(true);
            setEditedContent(comment.content);
        } catch (err) {
            console.log(err);
        }
    }

    const handleSave = async () => {
        if (!currentUser) {
            navigate("/sign-in");
            return;
        }
        try {
            const res = await fetch(`/api/comment/editcomment/${comment._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editedContent }),
            });
            if (res.ok) {
                setIsEdit(false);
                onEdit(comment, editedContent);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="flex p-4 border-b dark:border-gray-600 text-sm">
            <div className="flex-shrink-0 mr-3">
                <img src={user.profilePic} className="w-10 h-10 rounded-full bg-gray-200" alt={user.username} />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="font-bold mr-1 text-xs truncate">{user ? `@${user.username}` : "anonymous user"}</span>
                    <span className="text-gray-500 text-xs">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>

                {isEdit ? (
                    <>
                        <Textarea value={editedContent} rows={3} maxLength="200" onChange={(e) => setEditedContent(e.target.value)} />
                        <div className="mt-2 flex items-center gap-4 text-sm justify-end">
                            <Button type="button" gradientDuoTone="purpleToBlue" size="sm" onClick={handleSave}>Save</Button>
                            <Button type="button" gradientDuoTone="purpleToBlue" size="sm" outline onClick={() => setIsEdit(false)}>Cancel</Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-gray-500 pb-2">{comment.content}</p>
                        <div className="flex gap-2 items-center pt-2 text-sm border-t dark:border-gray-700 max-w-fit">
                            <button onClick={() => onLike(comment._id)} type="button" className={`text-sm text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && "!text-blue-500"}`}>
                                <FaThumbsUp />
                            </button>
                            <p className="text-gray-500">{comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "Like" : "Likes")}</p>
                            {currentUser && (currentUser._id === comment.userId) && (
                                <button className="text-gray-500 hover:text-blue-500 pl-2" onClick={handleEdit}>Edit</button>
                            )}
                            {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                <button className="text-gray-500 hover:text-red-500 pl-2" onClick={() => onDelete(comment._id)}>Delete</button>
                            )}
                        </div>
                    </>
                )}


            </div>
        </div>
    )
}