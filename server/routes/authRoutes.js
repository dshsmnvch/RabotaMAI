import express from 'express';
import {rateLimit} from 'express-rate-limit';
import { register, signIn } from '../controllers/authController.js';

//ip rate limit
const limiter = rateLimit({
    windowMs: 15*60*1000 ,//15min
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

const router = express.Router();
//regist rout
router.post("/register", limiter, register);
router.post("/login",  signIn);

export default router;


