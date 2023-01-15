import express from "express";
import { getFile } from "../controllers/FileController";
import {
  storeEngine,
  uploadSingleFile,
} from "../middlewares/UploadFileMiddleware";

const router = express.Router();

router.post(
  "/upload",
  storeEngine.single("profilePic"),
  uploadSingleFile,
  (req, res) => {
    try {
      return res.status(200).send({ message: "File stored successfully." });
    } catch (error) {
      return res.status(500).send({ message: "Something went wrong." });
    }
  }
);

router.get("/:fileId", getFile);

export default router;
