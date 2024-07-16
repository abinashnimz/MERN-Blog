import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";



export const DashProfile = ()=>{
    const { currentUser } = useSelector(state=>state.user);
    return(
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form className="flex flex-col gap-5">
                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                    <img src={currentUser.userdata.profilePic} alt="user" className="rounded-full w-full h-full object-cover border-8 border-[lightgray]" />
                </div>
                <TextInput type="text" id="username" placeholder="Username" defaultValue={currentUser.userdata.username} />
                <TextInput type="email" id="email" placeholder="Email" defaultValue={currentUser.userdata.email} />
                <TextInput type="password" id="password" placeholder="Password" />
                <Button type="submit" gradientDuoTone="purpleToBlue" outline>
                    Update
                </Button>
            </form>
            <div className="flex justify-between text-red-500 mt-5">
                <span className="cursor-pointer">Delete account</span>
                <span className="text-red-500 cursor-pointer">Sign Out</span>
            </div>
        </div>
    )
}