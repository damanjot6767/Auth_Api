import expess from "express";
import { addRemoveFriend, getUser, getUserFriends } from "../Controllers/users.js";
import { verifytoken } from "../middleware/verify.js";

const UserRouter = expess.Router();

UserRouter.get("/:id",verifytoken,getUser);
UserRouter.get("/:id/friends",verifytoken,getUserFriends);

UserRouter.patch("/:id/:friendId",verifytoken,addRemoveFriend);

export default UserRouter