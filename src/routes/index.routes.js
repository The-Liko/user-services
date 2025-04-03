import { Router } from 'express';
import { sendHomePage } from '../controller/responses/indexRes.js';

const indexRouter = Router();

indexRouter.get('/', sendHomePage);

export default indexRouter;
