import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, deletePost, getPost, updatePost } from "../controllers/post.controllers.js";

const router = express.Router();

router.post("/create" , verifyToken, create );
router.get("/getposts", getPost);
router.delete("/delete/:postId/:userId", verifyToken, deletePost);
router.put("/update/:postId/:userId", verifyToken, updatePost);

export default router;