import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { getUser, updateUser } from "../controllers/userController.js";

const router = express.Router()

//get user 
router.post('/get-user', userAuth, getUser);
//updateuser||put
router.put("/update-user", userAuth, updateUser);
export default router;