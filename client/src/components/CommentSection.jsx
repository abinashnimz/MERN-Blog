import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Comment } from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi"

export const CommentSection = ({ postId }) => {

    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [toDeleteCommentId, setToDeleteCommentId] = useState(null);

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
            return;
        }
        try {
            const res = await fetch("/api/comment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: comment, postId: postId, userId: currentUser._id })
            });
            const data = await res.json();
            if (res.ok) {
                setCommentError(null);
                setComment("");
                setComments([data, ...comments]);
            }
            if (!res.ok) {
                setCommentError(data.message);
            }
        } catch (err) {
            console.log(err);
            setCommentError(err.message);
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments/${postId}`, { method: "GET" });
                const data = await res.json();
                if (res.ok) {
                    setComments(data);
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchComments();
    }, [postId]);

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate("/sign-in");
                return;
            }
            const res = await fetch(`/api/comment/likecomment/${commentId}`, { method: "PUT" });
            const data = await res.json();
            if (res.ok) {
                setComments(comments.map((comment) =>
                    comment._id === commentId ? {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.numberOfLikes,
                    } : comment
                ))
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleEdit = async (comment, editedContent) => {
        if (!currentUser) {
            navigate("/sign-in");
            return;
        }
        setComments(
            comments.map((c) =>
                c._id === comment._id ? { ...c, content: editedContent } : c
            )
        );
    };

    const handleDeleteComment = async () => {
        try {
            if (!currentUser) {
                navigate("/sign-in");
                return;
            }
            setShowModal(false);
            if (!currentUser) {
                navigate("/sign-in");
                return
            }
            const res = await fetch(`/api/comment/deletecomment/${toDeleteCommentId}`, { method: "DELETE" });
            if (res.ok) {
                setComments(comments.filter((comment) => comment._id !== toDeleteCommentId));
                setToDeleteCommentId(null);
            }
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <div className="max-w-2xl mx-auto w-full p-3">
            {currentUser ? (
                <div className="flex gap-1 items-center my-5 text-sm text-gray-500">
                    <p>Signed in as:</p>
                    <img src={currentUser.profilePic} alt="" className="w-5 h-5 object-cover rounded-full" />
                    <Link to="/dashboard?tab=profile">
                        <p className="text-cyan-500 hover:underline">@{currentUser.username}</p>
                    </Link>
                </div>
            ) : (
                <div className="flex gap-1 items-center my-5 text-sm">
                    <p className="text-teal-500">Please sign in to comment: </p>
                    <Link to="/sign-in" className="text-blue-500 hover:underline">
                        Sign In
                    </Link>
                </div>
            )}

            {currentUser && (
                <form className="border border-teal-500 p-3 rounded-md" onSubmit={handleSubmit}>
                    <Textarea placeholder="Add a comment..." rows="3" maxLength="200" onChange={(e) => setComment(e.target.value)} value={comment} />
                    <div className="flex items-center justify-between mt-5">
                        <p className="text-gray-500 text-xs">{200 - comment.length} characters remaining</p>
                        <Button gradientDuoTone="purpleToBlue" outline type="submit">
                            Submit
                        </Button>
                    </div>
                    {commentError && (
                        <Alert color="failure" className="mt-5">{commentError}</Alert>
                    )}
                </form>
            )}
            {comments.length > 0 ? (
                <>
                    <div className="flex gap-1 items-center my-5 text-sm">
                        <p>Comments</p>
                        <p className="border border-gray-400 py-1 px-2 rounded-sm">{comments.length}</p>
                    </div>
                    {comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            onLike={handleLike}
                            onEdit={handleEdit}
                            onDelete={(commentId) => { setShowModal(true), setToDeleteCommentId(commentId) }} />
                    ))}
                </>) : (
                <p className="text-sm my-5">No comments yet!</p>
            )}
            {showModal && (
                <Modal show={showModal} onClose={() => setShowModal(false)} popup size="sm">
                    <Modal.Header onClick={() => setShowModal(false)} />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto mb-5" />
                            <h3 className="text-gray-600 dark:text-gray-200 mb-5">Delete comment</h3>
                        </div>
                        <div className="flex justify-between">
                            <Button color="failure" onClick={handleDeleteComment}>Yes, I'am sure</Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>No, Cancel</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </div>

    )
}