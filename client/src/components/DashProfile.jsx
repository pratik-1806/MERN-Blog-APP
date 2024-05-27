
import { useEffect, useRef } from "react";
import { useState } from "react";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess,deleteUserStart, deleteUserSuccess, deleteUserFailure , signOutSuccess} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from 'react-router-dom';


export default function DashProfile() {
  const { currentUser , error ,loading} = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData , setFormData] = useState({});
  const [imageFileUploading , setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal , setShowModal] = useState(false);
  const dispatch = useDispatch();
  
  console.log(imageFileUploadProgress, imageFileUrl);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage(imageFile);
    }
  }, [imageFile]);

  const uploadImage = async (imageFile) => {
    //     service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write : if
    //       request.resource.size<2*1024*1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const filename= new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError('Could not upload Photo (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFileUrl(null);
        setImageFile(null);
        setImageFileUploading(false);
      },
      
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUploadProgress(null);
          setImageFileUploadError(null);
          setImageFileUrl(downloadURL);
          setFormData({
            ...formData,
            profilePicture: downloadURL
          })
          setImageFileUploading(false);
        })  
      }
    );
    
  };

  const handleChange = (e)=> {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e)=> {
    
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if(Object.keys(formData).length === 0) {
      setUpdateUserError("Nothing to change");
      return;}
     
    if(imageFileUploading){
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try{
        dispatch(updateStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method:'PUT',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formData)
        });
        const data = await res.json();

        if(!res.ok){
          dispatch(updateFailure(data.message));
          setUpdateUserError(data.message);
        }else{
          dispatch(updateSuccess(data));
          setUpdateUserSuccess("User's Profile updated successfully")
        }

    }catch(error){
      dispatch(updateFailure(error.message));
    }
  }

  const handleDelteUser= async()=>{
    setShowModal(false);
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method:'DELETE'
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(deleteUserFailure(data.message));
      }else{
        dispatch(deleteUserSuccess(data));
      }

    }catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async()=>{
    try{
      const res = await fetch('/api/user/signout',{
        method:'POST'
      });
      const data = await res.json();
      if(!res.ok){
        return;
      }else{
        dispatch(signOutSuccess());
      }

    }catch(error){
      console.log(error);
    }
  }
 

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          className="hidden"
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
            strokeWidth={5}
            styles={{
              root:{
                width:'100%',
                height:'100%',
                position:'absolute',
                top:0,
                left:0,
                
              },
              path:{
                stroke:`rgb(62,152, 199, ${imageFileUploadProgress / 100})`,
              }
            }}/>
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full object-cover w-full h-full border-8 border-[lightgrey]
            ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-15'}`
            }
          />
        </div>
        {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}  onChange={handleChange}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email} onChange={handleChange}
        />
        <TextInput type="password" id="password" placeholder="password" onChange={handleChange}/>
        <Button type="submit" gradientDuoTone="purpleToBlue" outline disabled={loading || imageFileUploading}>
          Update
        </Button>
        
          {
            currentUser.isAdmin && (
              <Link to={'/create-post'}>
              <Button type="button" gradientDuoTone='purpleToPink' className="w-full">
                Create Post
              </Button>
              </Link>
            )
          }
        
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={()=>setShowModal(true)} className="cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess && <Alert color="success" className="mt-5">{updateUserSuccess}</Alert> }
      {updateUserError && <Alert color="failure" className="mt-5">{updateUserError}</Alert> }
      {error && <Alert color="failure" className="mt-5">{error}</Alert> }
      <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400  dark:text-gray-200 mb-4 mx-auto"/>
              </div>
            <h3 className="mb-5 text-lg  text-gray-500 dark:text-gray-400 text-center">Are you sure you want to delete your account?</h3>
            <div className="flex justify-center gap-4">
              <Button color='failure' onClick={handleDelteUser}>Yes, I'm sure</Button>
              <Button color='gray' onClick={()=>setShowModal(false)}>No, cancel</Button>
            </div>
            </Modal.Body>
      </Modal>
    </div>
  );
}
