import { Router } from "express";
import { createUser, getUser, getUserRanking, getUserUrls } from "../controllers/userController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import userSchema from "../schemas/userSchema.js";

const userRouter = Router();

userRouter.post('/', validateSchemaMiddleware(userSchema), createUser);
userRouter.get('/', validateTokenMiddleware, getUser);
userRouter.get('/ranking', getUserRanking);
userRouter.get('/:id', getUserUrls);

export default userRouter;