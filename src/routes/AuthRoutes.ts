import express from "express";
import {
  checkToken,
  confirmAccount,
  login,
  requireConfirmAccount,
  requireEmailReset,
  requirePasswordReset,
  resetEmail,
  resetPassword,
  updatePassword,
} from "../controllers/AuthController";
import AuthMiddleware from "../middlewares/AuthMiddleware";

const router = express.Router();

router.post("/login", login);

router.post("/login/token", checkToken);

router.post("/confirm-account/", confirmAccount);

router.post("/reset-email/", resetEmail);

router.post("/require-password-reset/", requirePasswordReset);

router.post("/reset-password/", resetPassword);

router.post(
  "/require-email-reset/",
  AuthMiddleware({ allowedRoles: "all" }),
  requireEmailReset
);

router.post(
  "/require-confirm-account",
  AuthMiddleware({ allowedRoles: ["moderator"] }),
  requireConfirmAccount
);

router.post(
  "/update-password",
  AuthMiddleware({ allowedRoles: "all" }),
  updatePassword
);

export default router;
