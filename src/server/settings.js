import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import indexRouter from '../routes/index.routes.js';
import { routeNotFound } from '../controller/responses/indexRes.js';
import userRouter from '../routes/user.routes.js';
import cartItemsRouter from '../routes/cartItem.routes.js';

const serverApp = express();
dotenv.config();

serverApp.set('port', process.env.PORT || 4000);
serverApp.use(cors());
serverApp.use(express.json());
serverApp.use(indexRouter);
serverApp.use(userRouter);
serverApp.use(cartItemsRouter);
serverApp.use(routeNotFound);

export default serverApp;
