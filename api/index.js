import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js"
import authRoute from "./routes/auth.route.js"
import postRoute from "./routes/post.route.js"
import commentRoute from "./routes/comment.route.js"
import cookieParser from "cookie-parser";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json())
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});


app.listen(3000, () => {
  console.log("server is running on port 3000");
});

//app routes

app.use("/api/user",userRoute);
app.use('/api/auth',authRoute);
app.use('/api/post', postRoute);
app.use('/api/comment', commentRoute);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal  error"
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })

})

