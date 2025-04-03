import { Router } from 'express';
import { login, signUp } from '../controller/requests/userReq.js';

const userRouter = Router();

userRouter.post('/login', login);
userRouter.post('/signup', signUp);

export default userRouter;
