import express from "express";
import authRoutes from "./auth.js"
import userRoutes from "./userRoutes.js";
import userProfileRoutes from "./userProfile.routes.js";
import noticeRoutes from "./noticeRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import jobRoutes from "./jobRoutes.js";
import formRoutes from "./formRoutes.js";
import adminRoutes from "./adminRoutes.js";
import { contactForm } from "../controllers/contactController.js";
const mainRouter = express.Router();

mainRouter.post("/sendMessage", contactForm);
mainRouter.use("/auth", authRoutes);
mainRouter.use('/user', userProfileRoutes);
mainRouter.use('/users', userRoutes);
mainRouter.use('/notices', noticeRoutes);
mainRouter.use('/jobs', jobRoutes);
mainRouter.use('/forms', formRoutes);
mainRouter.use('/admin', adminRoutes);
mainRouter.use("/notifications", notificationRoutes);

export default mainRouter;
