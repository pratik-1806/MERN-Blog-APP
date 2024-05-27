import { useState } from 'react'
import { useEffect } from "react"
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Button, Modal, Textarea } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function Comment({comment, onLike, onEdit, onDelete}) {
    
    const [user, setUser] = useState({});
    const {currentUser} = useSelector((state)=>state.user);
    const [isEditing , setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [showModal , setShowModal] = useState(false);
    
    useEffect(() => {
        const getUser = async ( )=>{
            try{
                const res = await fetch(`/api/user/${comment.userId}`)
                const data = await res.json();
                if(res.ok){
                    setUser(data);
                }

            }catch(err){
                console.log(err)
            }

        }
        getUser();
    },[comment])
    const handleEdit = ()=>{
        setIsEditing(true);
        setEditedContent(comment.content)
    }
    const handleSave = async () => {
        try {
          const res = await fetch(`/api/comment/editcomment/${comment._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: editedContent,
            }),
          });
          if (res.ok) {
            setIsEditing(false);
            onEdit(comment, editedContent);
          }
        } catch (error) {
          console.log(error.message);
        }
      };

  return (
    <div className='flex p-4 border-b dark:border-gray-600'>
        <div className="flex-shrink-0 mr-3">
            <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
        </div>
        <div className="flex-1">
            <div className="flex items-center mb-1">
                <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : "anonymous user"}</span>
                <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
            </div>
            {isEditing ?(
                <>
                <Textarea
                className='mb-2'
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}/>
                <div className="flex justify-end gap-2">
                    <Button type='button' size='sm' gradientDuoTone='purpleToBlue'
                    onClick={handleSave}>
                        Save
                        </Button>
                        <Button type='button' size='sm' gradientDuoTone='purpleToBlue' outline
                        onClick={()=>setIsEditing(false)}
                        >
                        Cancel
                        </Button>
                </div>
                </>
                
            ):(
                <>
                 <p className='text-gray-500 pb-2'>{comment.content}</p>
            <div className="flex gap-2 items-center text-xs border-t dark:border-gray-700 max-w-fit">
                <button className={`text-gray-400 hover:text-blue-500
                ${comment.likes.includes(currentUser._id) && '!text-blue-500'}`} onClick={()=>onLike(comment._id)}>
                    <FaThumbsUp className=' '/>
                </button>
                <p className='text-gray-500'>
                {
                    comment.numberOfLikes>0 && comment.numberOfLikes + " " +(comment.numberOfLikes===1 ? "like" : "likes")
                }
                </p>
                {
                    currentUser && (currentUser._id ===comment.userId || currentUser.isAdmin) &&
                    <>
                     <button className='text-gray-500 hover:text-blue-700' onClick={handleEdit}>Edit</button>
                    <button className='text-gray-500 hover:text-blue-700' onClick={()=>setShowModal(true)}>Delete</button></>
                    
                }
                
            </div>
                </>
            )}
            <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400  dark:text-gray-200 mb-4 mx-auto"/>
              </div>
            <h3 className="mb-5 text-lg  text-gray-500 dark:text-gray-400 text-center">Are you sure you want to delete this comment?</h3>
            <div className="flex justify-center gap-4">
              <Button color='failure' onClick={()=>onDelete(comment._id)}>Yes, I'm sure</Button>
              <Button color='gray' onClick={()=>setShowModal(false)}>No, cancel</Button>
            </div>
            </Modal.Body>
      </Modal>
           
        </div>
    </div>
  )
}
