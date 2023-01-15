import express from "express";
import { deleteFile, getFile } from "../controllers/FileController";
import {
  storeEngine,
  uploadSingleFile,
} from "../middlewares/UploadFileMiddleware";
import { ErrorResponse, handleErrors } from "../utils/HandleErrorsUtils";

const router = express.Router();

router.post(
  "/upload",
  storeEngine.single("profilePic"),
  uploadSingleFile,
  (req, res) => {
    try {
      return res.status(200).send({ fileId: req.res?.locals.fileId });
    } catch (error) {
      const response: ErrorResponse | null = handleErrors(error);
      if (response)
        return res.status(response.code).send({ message: response.message });

      return res.status(500).send({ message: "Something went wrong." });
    }
  }
);

router.get("/:fileId", getFile);

router.delete("/:fileId", deleteFile);

export default router;
