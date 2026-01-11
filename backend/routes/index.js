import express from "express";
import authRoutes from "./auth.js"
import userRoutes from "./userRoutes.js";
import noticeRoutes from "./noticeRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import fileRoutes from "./fileRoutes.js";
import { contactForm } from "../controllers/contactController.js";
import countController from "../controllers/countController.js";
const mainRouter = express.Router();

mainRouter.get("/stats", countController);
mainRouter.use("/auth", authRoutes);
mainRouter.use('/users', userRoutes);
mainRouter.use('/notices', noticeRoutes);
mainRouter.use('/files', fileRoutes);
mainRouter.use("/sendMessage", contactForm);
mainRouter.use("/notifications", notificationRoutes);

export default mainRouter;
