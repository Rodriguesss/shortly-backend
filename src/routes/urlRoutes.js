import { Router } from "express";
import { createUrl, deleteUrl, getUrl } from "../controllers/urlController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const urlRouter = Router();

urlRouter.post('/shorten', validateTokenMiddleware, createUrl);
urlRouter.get('/:shortUrl', getUrl);
urlRouter.delete('/:id', validateTokenMiddleware, deleteUrl);

export default urlRouter;