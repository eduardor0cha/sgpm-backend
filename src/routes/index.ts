import express from "express";
import AuthRoutes from "./AuthRoutes";
import FileRoutes from "./FileRoutes";
import UserRoutes from "./UserRoutes";

const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);
router.use("/files", FileRoutes);

export default router;
