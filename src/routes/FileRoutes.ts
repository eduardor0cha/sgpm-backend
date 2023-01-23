import express, { Request, Response } from "express";
import { deleteFile, getFile } from "../controllers/FileController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { uploadSingleFile } from "../middlewares/UploadFileMiddleware";
import { ErrorResponse, handleErrors } from "../utils/HandleErrorsUtils";

const router = express.Router();

router.get("/:fileId", AuthMiddleware({ allowedRoles: "all" }), getFile);

router.post(
  "/upload",
  AuthMiddleware({ allowedRoles: ["moderator"] }),
  uploadSingleFile({
    fieldName: "file",
    required: true,
    maxSize: 5242880,
  }),
  (req: Request, res: Response) => {
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

router.delete(
  "/:fileId",
  AuthMiddleware({ allowedRoles: ["moderator"] }),
  deleteFile
);

export default router;
