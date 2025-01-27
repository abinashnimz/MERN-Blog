import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';



export const CreatePost = () => {

    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadingError, setImageUploadingError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);

    const navigate = useNavigate();

    const handleUploadImage = () => {
        try {
            setImageUploadingError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + "-" + file.name.trim();
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_change",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed());
                },
                (error) => {
                    setImageUploadingError("Upload failed");
                    setImageUploadProgress(null);
                },
                () => {
                    setImageUploadProgress(null);
                    setImageUploadingError(null)
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setFormData({ ...formData, image: downloadURL });
                    })
                }
            )
        } catch (err) {
            setImageUploadingError("Upload failed");
            console.log(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/post/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            const data = await res.json();
            if (data.success === false) {
                setPublishError(data.message);
                return;
            }
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            if (res.ok) {
                setPublishError(null);
                navigate(`/post/${data.slug}`);
            }
        } catch (err) {
            setPublishError(err.message);
        }
    }

    return (
        <div className="p-4 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl font-semibold my-7">Create Post</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput type="text" placeholder="Title" required id="title" className="flex-1" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                            <option value="uncategorized">Select a category</option>
                            <option value="javascript">JavaScript</option>
                            <option value="reactjs">React.Js</option>
                            <option value="nextjs">Next.Js</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center justify-around border-4 border-teal-500 border-dotted p-3">
                    <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} onClick={(e) => setImageUploadingError(null)} />
                    {
                        !imageUploadingError ? <Alert color="gray" className="p-2.5 text-center">Image file should less than 2MB</Alert> :
                            (imageUploadingError && <Alert color="failure" className="p-2.5 text-center">{imageUploadingError}</Alert>)
                    }
                    <Button gradientDuoTone="purpleToBlue" size="sm" outline onClick={handleUploadImage} disabled={imageUploadProgress}>
                        {
                            imageUploadProgress ?
                                (<div className="w-16 h-16">
                                    <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                                </div>) : "Upload image"
                        }
                    </Button>
                </div>
                        {
                            formData.image && (
                                <img src={formData.image} alt="post_image" className="w-full h-72 object-cover" />
                            )
                        }
                        <ReactQuill theme="snow" placeholder="Write something" className="h-72 mb-12" required onChange={(value) => setFormData({ ...formData, content: value })} />
                        {publishError && <Alert color={"failure"}>{publishError}</Alert>}
                        <Button gradientDuoTone="purpleToPink" type="submit">
                            Publish
                        </Button>
            </form>

        </div>
    )
}