import { Alert, Button, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link,useNavigate } from "react-router-dom";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (comment.length > 200) {
        return alert("comment cannot exceed 200 character");
      }
      const res = await fetch(`/api/comment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      const res = await fetch(`/api/comment/getpostcomments/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId )=>{
    try{
      if(!currentUser){
        navigate("/sign-in")
        return;
      }
      const res = await fetch(`/api/comment/likecomment/${commentId}`,{
        method:"PUT",
      });
      if(res.ok){
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }

    }catch(error){
        console.log(error.message)
    }
  };
  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };
  
  const handleDelete = async (commentId)=>{
    try{
      const res = await fetch(`/api/comment/deletecomment/${commentId}`,{
        method:"DELETE",
      });
      if(res.ok){
        setComments(comments.filter((c)=> c._id !== commentId))
      }

    }catch(error){
        console.log(error.message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex flex-row items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Sign in as:</p>
          <img
            src={currentUser.profilePicture}
            className="w-5 h-5 object-cover rounded-full "
          />
          <Link
            to={`/dashboard?tab=profile`}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className=" text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:uppercase" to={`/sign-in`}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && <Alert color="failure">{commentError}</Alert>}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No Comments yet!!!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p> Comments</p>
            <div className="border border-gray-500 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike = {handleLike}  onEdit ={handleEdit} onDelete ={handleDelete}/>
          ))}
        </>
      )}
    </div>
  );
}
