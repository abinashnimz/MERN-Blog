import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi"

export const DashComments = () => {

    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [totalComments, setTotalComments] = useState(null);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await fetch("/api/comment/getAllComments", { method: "GET" });
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                }
                if (data.totalComments > 9) {
                    setShowMore(true)
                }
            } catch (err) {
                console.log(err);
            }
        }
        if (currentUser.isAdmin) {
            getPosts();
        }
    }, [currentUser.isAdmin]);

    const handleShowMore = async () => {
        try {
            const startIndex = comments.length;
            const res = await fetch(`/api/comment/getAllComments?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments]);
            }
            if (totalComments === comments.length) {
                setShowMore(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleDeletePost = async () => {
        try {
            setShowModal(false);
            const res = await fetch(`/api/comment/deletecomment/${commentIdToDelete}`, {method:"DELETE"});
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
            }
            if(res.ok){
                setComments(comments.filter((comment)=> comment._id !==commentIdToDelete));
            }
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div className="p-3 table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {(currentUser.isAdmin && comments.length > 0) ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>Number of Likes</Table.HeadCell>
                            <Table.HeadCell>post id</Table.HeadCell>
                            <Table.HeadCell>User id</Table.HeadCell>
                            <Table.HeadCell>delete</Table.HeadCell>
                        </Table.Head>
                        {comments.map((comment, ind) => (
                            <Table.Body className="divide-y" key={ind}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        {new Date(comment.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.content}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.postId}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.userId}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span onClick={() => { setShowModal(true), setCommentIdToDelete(comment._id) }} className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore &&
                        <button type="button" onClick={handleShowMore} className="w-full self-center py-7 text-sm text-teal-500 hover:underline">Show more</button>
                    }
                    <Modal show={showModal} onClose={() => setShowModal(false)} popup size="sm">
                        <Modal.Header onClick={() => setShowModal(false)} />
                        <Modal.Body>
                            <div className="text-center">
                                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto mb-5" />
                                <h3 className="text-gray-600 dark:text-gray-200 mb-5">Are you sure you want delete this comment</h3>
                            </div>
                            <div className="flex justify-between">
                                <Button color="failure" onClick={handleDeletePost}>Yes, I'am sure</Button>
                                <Button color="gray" onClick={() => setShowModal(false)}>No, Cancel</Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </>
            ) : (
                <p>No comments</p>
            )}
        </div>
    )
}