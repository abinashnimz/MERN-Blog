import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";



export const DashProfile = ()=>{
    const { currentUser, error, loading } = useSelector(state=>state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState();
    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(false);
    // console.log(imageFileUploadingProgress);
    // console.log(imageFileUploadingError);
    // console.log(imageFileUrl);
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    // console.log(currentUser);
    // console.log(formData);

    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        if(file){
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    useEffect(()=>{
        if(imageFile){
            uploadImage();
        }
    }, [imageFile]);
    const uploadImage = async ()=>{
        // Fire base bucket rule:
        // service firebase.storage {
        //     match /b/{bucket}/o {
        //       match /{allPaths=**} {
        //         allow read;
        //         allow write: if
        //         request.resource.size < 2*1024*1024 &&
        //         request.resource.contentType.matches('image/.*')
        //       }
        //     }
        // }
        setImageFileUploading(true);
        setImageFileUploadingError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime()+imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            "state_change",
            (snapshot)=>{
                const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                setImageFileUploadingProgress(progress.toFixed(0));
            },
            (error)=>{
                setImageFileUploadingError("Could not upload image (File must be less thatn 2MB)");
                setImageFileUploadingProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    setImageFileUrl(downloadURL);
                    setFormData({...formData, profilePic:downloadURL})
                    setImageFileUploading(false);
                })
            }
        )
    }

    const handleChange = (e)=>{
        setFormData({...formData, [e.target.id]:e.target.value});
        setUpdateUserSuccess(null);
        setUpdateUserError(null);
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(Object.keys(formData).length===0){
            setUpdateUserError("No changes made");
            return;
        }
        if(imageFileUploading){
            setUpdateUserError("Please wait for image upload");
            return;
        }
        try{
            //? remaining work to be done
            //if password is blannk in current state then remove password from current state.
            //if each formdata matches previous state then no changes
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(formData)
            });
            // console.log(res);
            const data = await res.json();
            // console.log(data);
            if(!res.ok){
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            }else{
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User updated successfully");
                setTimeout(()=>{
                    setUpdateUserSuccess(null);
                },4000)
            }
        }catch(err){
            dispatch(updateFailure(err.message));
            setUpdateUserError(data.message);
        }
    }
    const handleDeleteUser = async ()=>{
        setShowModal(false);
        try{
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`,{
                method: "DELETE"
            });
            const data = res.json();
            if(!res){
                dispatch(deleteUserFailure(data.message));
            }else{
                dispatch(deleteUserSuccess(data))
            }
        }catch(err){
            dispatch(deleteUserFailure(err.message));
        }
    }

    const handleSignout = async ()=>{
        try{
            const res = await fetch("/api/user/signout", {
                method: "POST"
            })
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
            }else{
                dispatch(signoutSuccess());
            }
        }catch(err){
            console.log(err);
        }
    }

    return(
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=>filePickerRef.current.click()}>
                    {imageFileUploadingProgress && (
                        <CircularProgressbar value={imageFileUploadingProgress || 0} strokeWidth={5} styles={{
                            root:{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                top: 0,
                                left:0.
                            },
                            path: {
                                stroke: `rgba(62, 152, 199, ${imageFileUploadingProgress/100})`
                            }
                        }}/>
                    )}
                    <img src={imageFileUrl || currentUser.profilePic} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadingProgress && imageFileUploadingProgress <100 && "opacity-60"}`} />
                </div>
                {
                    imageFileUploadingError && <Alert color="failure">{imageFileUploadingError}</Alert>
                }
                
                <TextInput type="text" id="username" placeholder="Username" defaultValue={currentUser.username} onChange={handleChange}/>
                <TextInput type="email" id="email" placeholder="Email" defaultValue={currentUser.email} onChange={handleChange}/>
                <TextInput type="password" id="password" placeholder="Password" onChange={handleChange}/>
                <Button type="submit" gradientDuoTone="purpleToBlue" outline disabled={loading || imageFileUploading}>
                    Update
                </Button>
                {currentUser.isAdmin && (
                    <Link to="/create-post">
                        <Button type="button" gradientDuoTone="purpleToPink" className="w-full">
                        Create a post
                        </Button>
                    </Link>
                )}
                
            </form>
            <div className="flex justify-between text-red-500 mt-5">
                <span className="cursor-pointer" onClick={()=>setShowModal(true)}>Delete account</span>
                <span className="text-red-500 cursor-pointer" onClick={handleSignout}>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color="success" className="mt-5">{updateUserSuccess}</Alert>
            )}
            {updateUserError && (
                <Alert color="failure" className="mt-5">{updateUserError}</Alert>
            )}
            {error && (
                <Alert color="failure" className="mt-5">{error}</Alert>
            )}
            <Modal show={showModal} onClose={()=> setShowModal(false)} popup size="md">
                <Modal.Header onClick={()=>setShowModal(false)}/>
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto mb-5"/>
                            <h3 className="text-gray-600 dark:text-gray-200 mb-5">Are you sure you want delete your account?</h3>
                        </div>
                        <div className="flex justify-between">
                            <Button color="failure" onClick={handleDeleteUser}>Yes, I'am sure</Button>
                            <Button color="gray" onClick={()=>setShowModal(false)}>No, Cancel</Button>
                        </div>
                    </Modal.Body>
            </Modal>
        </div>
    )
}