import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';



export const DashProfile = ()=>{
    const { currentUser } = useSelector(state=>state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
    // console.log(imageFileUploadingProgress);
    // console.log(imageFileUploadingError);
    // console.log(imageFileUrl);
    const filePickerRef = useRef();

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
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    setImageFileUrl(downloadURL);
                })
            }
        )
    }

    return(
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form className="flex flex-col gap-5">
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
                    <img src={imageFileUrl || currentUser.userdata.profilePic} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadingProgress && imageFileUploadingProgress <100 && "opacity-60"}`} />
                </div>
                {
                    imageFileUploadingError && <Alert color="failure">{imageFileUploadingError}</Alert>
                }
                
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