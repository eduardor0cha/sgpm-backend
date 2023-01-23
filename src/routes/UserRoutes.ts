import express from "express";
import {
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/UserController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { uploadSingleFile } from "../middlewares/UploadFileMiddleware";

const router = express.Router();

router.put(
  "/:cpf",
  AuthMiddleware({ allowedRoles: "all" }),
  uploadSingleFile({
    fieldName: "profilePic",
    required: false,
    maxSize: 5242880,
  }),
  updateUser
);

router.post(
  "/create",
  AuthMiddleware({ allowedRoles: ["moderator"] }),
  createUser
);

router.delete(
  "/:cpf",
  AuthMiddleware({ allowedRoles: ["moderator"] }),
  deleteUser
);

export default router;
