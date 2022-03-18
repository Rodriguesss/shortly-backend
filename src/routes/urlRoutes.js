import { Router } from "express";
import { createUrl, deleteUrl, getUrl } from "../controllers/urlController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import urlSchema from '../schemas/urlSchema.js'

const urlRouter = Router();

urlRouter.post('/shorten', [validateTokenMiddleware, validateSchemaMiddleware(urlSchema)], createUrl);
urlRouter.get('/:shortUrl', getUrl);
urlRouter.delete('/:id', validateTokenMiddleware, deleteUrl);

export default urlRouter;