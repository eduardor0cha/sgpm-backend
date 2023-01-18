import express from "express";
import {
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/UserController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { uploadSingleFile } from "../middlewares/UploadFileMiddleware";

const router = express.Router();

router.use(AuthMiddleware({ allowedRoles: "all" }));

router.put(
  "/:cpf",
  uploadSingleFile({
    fieldName: "profilePic",
    required: false,
    maxSize: 5242880,
  }),
  updateUser
);

router.use(AuthMiddleware({ allowedRoles: ["moderator"] }));

router.post("/create", createUser);

router.delete("/:cpf", deleteUser);

export default router;
