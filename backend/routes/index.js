import express from "express";
import authRoutes from "./auth.js"
import userRoutes from "./userRoutes.js";
import noticeRoutes from "./noticeRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import jobRoutes from "./jobRoutes.js";
import formRoutes from "./formRoutes.js";
import adminRoutes from "./adminRoutes.js";
import { contactForm } from "../controllers/contactController.js";
import countController from "../controllers/countController.js";
const mainRouter = express.Router();

mainRouter.get("/stats", countController);
mainRouter.use("/auth", authRoutes);
mainRouter.use('/users', userRoutes);
mainRouter.use('/notices', noticeRoutes);
mainRouter.use('/jobs', jobRoutes);
mainRouter.use('/forms', formRoutes);
mainRouter.use('/admin', adminRoutes);
mainRouter.use("/sendMessage", contactForm);
mainRouter.use("/notifications", notificationRoutes);

export default mainRouter;
