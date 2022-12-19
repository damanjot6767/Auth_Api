import expess from "express";
import { getPosts, getUserPosts, likePost } from "../Controllers/Post.js";
import { verifytoken } from "../middleware/verify.js";


const postRouter = expess.Router();

postRouter.get("/",verifytoken,getPosts);
postRouter.get("/:userId/posts",verifytoken,getUserPosts);

postRouter.patch("/:id/like",verifytoken,likePost);

export default postRouter

