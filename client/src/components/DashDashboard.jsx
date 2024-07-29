import { useSelector } from "react-redux"
import { useState, useEffect } from "react";
import { HiOutlineUserGroup,HiAnnotation,HiDocumentText, HiArrowNarrowUp } from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export const DashDashboard = () => {

    const { currentUser } = useSelector((state) => state.user);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentPosts, setRecentPosts] = useState([]);
    const [recentComments, setRecentComments] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const [userError, setUserError] = useState(null);
    const [postError, setPostError] = useState(null);
    const [commentError, setCommentError] = useState(null);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers?limit=5`, { method: "GET" });
                const data = await res.json();
                if (!res.ok) {
                    setUserError(data.message);
                }
                if (res.ok) {
                    setUserError(null);
                    setRecentUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            } catch (err) {
                console.log(err.message);
            }
        }
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?limit=5`, { method: "GET" });
                const data = await res.json();
                if (!res.ok) {
                    setPostError(data.message);
                }
                if (res.ok) {
                    setPostError(null);
                    setRecentPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (err) {
                console.log(err.message);
            }
        }
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getallcomments?limit=5`, { method: "GET" });
                const data = await res.json();
                if (!res.ok) {
                    setCommentError(data.message);
                }
                if (res.ok) {
                    setCommentError(null);
                    setRecentComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (err) {
                console.log(err.message);
            }
        }
        if (currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currentUser.isAdmin]);



    return (
        <div className="p-3 md:mx-auto">
            <div className="flex-wrap flex gap-4 justify-center">
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
                            <p className="text-2xl">{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="flex items-center text-green-500 text-sm">
                            <HiArrowNarrowUp/>
                            {lastMonthUsers}
                        </span>
                        <div className="text-grey-500">Last Month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">total comments</h3>
                            <p className="text-2xl">{totalComments}</p>
                        </div>
                        <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="flex items-center text-green-500 text-sm">
                            <HiArrowNarrowUp/>
                            {lastMonthComments}
                        </span>
                        <div className="text-grey-500">Last Month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 text-md uppercase">total posts</h3>
                            <p className="text-2xl">{totalPosts}</p>
                        </div>
                        <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="flex items-center text-green-500 text-sm">
                            <HiArrowNarrowUp/>
                            {lastMonthPosts}
                        </span>
                        <div className="text-grey-500">Last Month</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2 capitalize">Recent users</h1>
                        <Button gradientDuoTone="purpleToPink" size="sm" outline>
                            <Link to="/dashboard?tab=users">See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>user image</Table.HeadCell>
                            <Table.HeadCell>username</Table.HeadCell>
                        </Table.Head>
                        {recentUsers && recentUsers.map((user, ind)=>(
                            <Table.Body key={ind} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        <img className="w-8 h-8 rounded-full bg-gray-500" src={user.profilePic} alt="user" />
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2 capitalize">Recent comments</h1>
                        <Button gradientDuoTone="purpleToPink" size="sm" outline>
                            <Link to="/dashboard?tab=comments">See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>likes</Table.HeadCell>
                        </Table.Head>
                        {recentComments && recentComments.map((comment, ind)=>(
                            <Table.Body key={ind} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="w-96">
                                        <p className="line-clamp-2">{comment.content}</p>
                                    </Table.Cell>
                                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2 capitalize">Recent posts</h1>
                        <Button gradientDuoTone="purpleToPink" size="sm" outline>
                            <Link to="/dashboard?tab=posts">See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>post image</Table.HeadCell>
                            <Table.HeadCell>post title</Table.HeadCell>
                            <Table.HeadCell>category</Table.HeadCell>
                        </Table.Head>
                        {recentPosts && recentPosts.map((post, ind)=>(
                            <Table.Body key={ind} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        <img src={post.image} alt="post-image" className="w-12 h-8 bg-gray-500" />
                                    </Table.Cell>
                                    <Table.Cell className="w-96">{post.title}</Table.Cell>
                                    <Table.Cell className="w-6">{post.category}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
            </div>
        </div>
    )
}