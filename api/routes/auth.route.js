import express from "express";
import { googleAuth, signIn, signup} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/signin",signIn);

router.post("/google",googleAuth);


export default router;