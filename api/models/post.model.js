import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  image :{
    type: String,
    default: 'https://img.freepik.com/premium-photo/social-media-blog-concept-futuristic-icon-design-graphics-hand-with-smartphone_102583-6104.jpg'
  },
  category:{
    type: String,
    default:'uncategorized'
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },  
},{timestamps:true }
); 

export default mongoose.model("Post", postSchema);