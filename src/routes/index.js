import { Router } from "express";
import authRouter from "./authRouter.js";
import urlRouter from "./urlRoutes.js";
import userRouter from "./userRouter.js";

const router = Router();
router.use(authRouter);
router.use('/users', userRouter);
router.use('/urls', urlRouter);

export default router;