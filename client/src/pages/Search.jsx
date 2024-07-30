import { Button, Label, Select, TextInput } from "flowbite-react"
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { PostCard } from "../components/PostCard";

export const Search = () => {

    const location = useLocation();
    const [sideBarData, setSideBarData] = useState({
        searchTerm: "",
        order: "desc",
        category: "",
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [showMore, setShowMore] = useState(false);

    const navigate = useNavigate();

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromURL = urlParams.get("searchTerm");
        const orderFromURL = urlParams.get("order");
        const categoryFromURL = urlParams.get("category");

        if(searchTermFromURL || orderFromURL || categoryFromURL){
            setSideBarData({
                ...sideBarData,
                searchTerm : searchTermFromURL,
                order : orderFromURL,
                category : categoryFromURL
            })
        }

        const fetchPost = async ()=>{
            const searchQuery = urlParams.toString();
            console.log("searchQuery", searchQuery);
            try{
                const res = await fetch(`/api/post/getposts?${searchQuery}`);
                const data = await res.json();
                if(!res.ok){
                    setLoading(true);
                    return;
                }
                if(res.ok){
                    setPosts(data.posts);
                    setLoading(false);
                    if(data.posts.length === 9){
                        setShowMore(true);
                    }else{
                        setShowMore(false);
                    }
                }
            }catch(err){
                console.log(err);
            }
        };
        fetchPost();
        
    }, [location.search]);

    const handleChange = (e)=>{
        if(e.target.id === "searchTerm"){
            setSideBarData({...sideBarData, searchTerm: e.target.value});
        }
        if(e.target.id === "order"){
            const order = e.target.value || "desc";
            setSideBarData({...sideBarData, order: order});
        }
        if(e.target.id === "category"){
            const category = e.target.value;
            setSideBarData({...sideBarData, category: category});
        }
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", sideBarData.searchTerm);
        urlParams.set("order", sideBarData.order);
        urlParams.set("category", sideBarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const handleShowMore = async ()=>{
        try{
            const urlParams = new URLSearchParams(location.search);
            const numberOfPosts = posts.length;
            const startIndex = numberOfPosts;
            urlParams.set("startIndex", startIndex);
            const searchQuery = urlParams.toString();
            console.log(searchQuery);
            const res = await fetch(`/api/post/getposts?${searchQuery}`, {method:"GET"});
            const data = await res.json();
            if(!res.ok){
                return;
            }
            if(res.ok){
                setPosts([...posts, ...data.posts]);
                if(data.posts.length === 9){
                    setShowMore(true);
                }else{
                    setShowMore(false);
                }
            }
        }catch(err){
            console.log(err);
        }
    }


    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2">
                        <Label className="whitespace-nowrap font-semibold">Search Term:</Label>
                        <TextInput type="text" placeholder="Search..." id="searchTerm" value={sideBarData.searchTerm} onChange={handleChange} className="w-full"/>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label className="whitespace-nowrap font-semibold">Order:</Label>
                        <Select id="order" value={sideBarData.order} onChange={handleChange} className="w-full">
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label className="whitespace-nowrap font-semibold">Category:</Label>
                        <Select id="category" value={sideBarData.category} onChange={handleChange} className="w-full">
                            <option value="">All</option>
                            <option value="uncategorized">Uncategorized</option>
                            <option value="reactjs">React.js</option>
                            <option value="nextjs">Next.js</option>
                            <option value="javascript">JavaScript</option>
                        </Select>
                    </div>
                    <Button type="submit" gradientDuoTone="purpleToPink" outline>Apply Filters</Button>
                </form>
            </div>
            <div className="w-full">
                <h1 className="p-5 text-3xl font-semibold sm:border-b border-gray-500">Post results:</h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {!loading && posts.length === 0 && (
                        <p className="text-gray-500">No Post found.</p>
                    )}
                    {loading && (
                        <p className="text-xl text-gray-500">Loading...</p>
                    )}
                    {!loading && posts && (
                        posts.map((post, ind)=><PostCard post={post} key={ind}/>)
                    )}
                    {showMore && (
                        <button className="text-teal-500 text-lg hover:underline w-full items-center" onClick={handleShowMore}>Show more</button>
                    )}
                </div>
            </div>
        </div>
    )
}