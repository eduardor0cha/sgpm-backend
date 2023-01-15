import express from "express";
import FileRoutes from "./FileRoutes";

const router = express.Router();

router.use("/files", FileRoutes);

export default router;
