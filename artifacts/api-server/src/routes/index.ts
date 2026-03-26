import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import coinsRouter from "./coins.js";
import templatesRouter from "./templates.js";
import phonesRouter from "./phones.js";
import transfersRouter from "./transfers.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(coinsRouter);
router.use(templatesRouter);
router.use(phonesRouter);
router.use(transfersRouter);

export default router;
