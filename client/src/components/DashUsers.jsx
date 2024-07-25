import { Button, Modal, Table } from "flowbite-react"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from "react-icons/hi";


export const DashUsers = () => {

    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [showMore, setShowMore] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                }
                if (res.ok) {
                    setUsers(data.users);
                }
            } catch (err) {
                console.log(err);
            }
        }
        if (currentUser.isAdmin) {
            fetchUsers();
        }
    }, [currentUser._id]);

    const handleShowMore = async ()=>{
        const startIndex = users.length;
        try{
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
            }
            if(res.ok){
                setUsers((prev)=> [...prev, ...data.users]);
                if(data.users.length < 9){
                    setShowMore(false);
                }
            }
        }catch(err){
            console.log(err);
        }
    }

    const handleDeleteUser = async ()=>{
        setShowModal(false);
        try{
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
            }
            if(res.ok){
                setUsers((prev)=>
                    prev.filter((user)=> user._id !==userIdToDelete)
                );
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div className="p-3 table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>date created</Table.HeadCell>
                            <Table.HeadCell>user img</Table.HeadCell>
                            <Table.HeadCell>username</Table.HeadCell>
                            <Table.HeadCell>admin</Table.HeadCell>
                            <Table.HeadCell>delete</Table.HeadCell>
                        </Table.Head>
                        {users.map((user, ind) => (
                            <Table.Body className="divide-y" key={ind}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <img src={user.profilePic} alt={user.username} className="w-10 h-10 object-cover bg-gray-500" />
                                    </Table.Cell>
                                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                                        {user.username}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.isAdmin ? (
                                            <FaCheck className="text-green-500 align-center" />
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                            <span className="text-red-500 hover:underline cursor-pointer font-medium" onClick={()=>{setShowModal(true), setUserIdToDelete(user._id)}}>Delete</span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>

                    {showMore && (
                        <button onClick={handleShowMore} className="w-full self-center text-teal-500 text-sm py-7">Show more</button>
                    )}

                    <Modal show={showModal} onClose={()=> setShowModal(false)} popup size="md">
                        <Modal.Header onClick={()=> setShowModal(false)}/>
                        <Modal.Body>
                        <div className="text-center">
                                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto mb-5" />
                                <h3 className="text-gray-600 dark:text-gray-200 mb-5">Are you sure you want delete this post</h3>
                            </div>
                            <div className="flex justify-between">
                                <Button color="failure" onClick={handleDeleteUser}>Yes, I'am sure</Button>
                                <Button color="gray" onClick={() => setShowModal(false)}>No, Cancel</Button>
                            </div>
                        </Modal.Body>
                    </Modal>

                </>
            ) : (
                <p>No users</p>
            )}
        </div>
    )
}