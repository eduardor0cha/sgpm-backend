import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ErrorResponse, handleErrors } from "../utils/HandleErrorsUtils";
import bcrypt from "bcrypt";
import { userSelect } from "../domain/types/PrismaSelects";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import {
  getUniqueAccountConfirmationToken,
  getUniqueEmailResetToken,
  getUniquePasswordResetToken,
} from "../utils/AuthUtils";
import { sendConfirmationEmail } from "../utils/EmailSender";
import { AuthCustomRequest } from "../domain/types/Auth";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    const userByEmail = await prisma.user.findUnique({
      where: {
        email_isActive: {
          email: login,
          isActive: true,
        },
      },
    });

    const userByUsername = await prisma.user.findUnique({
      where: {
        username_isActive: {
          username: login,
          isActive: true,
        },
      },
    });

    const user = userByEmail || userByUsername;

    if (!user)
      return res
        .status(400)
        .send({ message: "Username, email, or password are invalid." });

    if (!user.confirmedAccount) {
      return res.status(400).send({
        message: "Account is not confirmed yet.",
        confirmedAccount: false,
      });
    }

    if (!(await bcrypt.compare(password, user.password)))
      return res
        .status(400)
        .send({ message: "Username, email, or password are invalid." });

    const token = jwt.sign(
      { cpf: user.cpf, role: user.role },
      process.env.JWT_KEY!,
      {
        expiresIn: "1d",
      }
    );

    const response = await prisma.user.findUniqueOrThrow({
      where: {
        cpf_isActive: {
          cpf: user.cpf,
          isActive: true,
        },
      },
      select: userSelect,
    });

    return res.status(200).send({ user: response, token: token });
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const checkToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    jwt.verify(
      token,
      process.env.JWT_KEY as Secret,
      async (
        err: jwt.VerifyErrors | null,
        decoded: string | jwt.JwtPayload | undefined
      ) => {
        if (err) return res.status(200).send({ isValid: false });

        if (!decoded) throw Error;

        const userId = (decoded as JwtPayload)["cpf"];

        const user = await prisma.user.findUnique({
          where: {
            cpf_isActive: {
              cpf: String(userId),
              isActive: true,
            },
          },
        });

        if (!user) return res.status(200).send({ isValid: false });

        if (!user.confirmedAccount) {
          return res.status(200).send({ isValid: false });
        }

        const response = await prisma.user.findUnique({
          where: {
            cpf_isActive: {
              cpf: String(userId),
              isActive: true,
            },
          },
          select: userSelect,
        });

        return res.status(200).send({ isValid: true, user: response });
      }
    );
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const requireConfirmAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        cpf_isActive: {
          cpf: userId,
          isActive: true,
        },
      },
    });

    if (!user) return res.status(400).send({ message: "User not found." });

    if (user.confirmedAccount)
      res.status(400).send({ message: "Account already confirmed." });

    if (!user.email) throw Error;

    const uniqueAccountConfirmationToken =
      await getUniqueAccountConfirmationToken({
        userId,
        days: 7,
      });

    const accountConfirmationToken =
      await prisma.accountConfirmationToken.create({
        data: uniqueAccountConfirmationToken,
      });

    await sendConfirmationEmail({
      userFullName: user.name,
      email: user.email,
      token: accountConfirmationToken.token,
      days: 7,
      type: "accountConfirmation",
    });

    return res
      .status(200)
      .send({ message: "Account confirmation required successfully." });
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const confirmAccount = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!password)
      return res.status(400).send({ message: "New password not provided." });

    const accountConfirmationToken =
      await prisma.accountConfirmationToken.findUnique({
        where: {
          token: token,
        },
      });

    if (!accountConfirmationToken)
      return res.status(400).send({ message: "Account already confirmed." });

    const encryptedPw = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        cpf_isActive: {
          cpf: accountConfirmationToken.userId,
          isActive: true,
        },
      },
      data: {
        confirmedAccount: true,
        password: encryptedPw,
      },
    });

    await prisma.accountConfirmationToken.delete({
      where: {
        token: accountConfirmationToken.token,
      },
    });

    return res.status(200).send({ message: "Account confirmed successfully." });
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const requireEmailReset = async (req: Request, res: Response) => {
  try {
    const { userId, userRole } = req as AuthCustomRequest;

    const { userCpf, email } = req.body;

    if (userRole != "moderator" && userId != userCpf)
      return res.status(401).send({ message: "User not allowed." });

    const user = await prisma.user.findUnique({
      where: {
        cpf_isActive: {
          cpf: userCpf,
          isActive: true,
        },
      },
    });

    if (!user) return res.status(400).send({ message: "User not found." });

    if (!user.email) throw Error;

    const uniqueEmailResetToken = await getUniqueEmailResetToken({
      userId: userCpf,
      days: 7,
      email: email,
    });

    const emailResetToken = await prisma.emailResetToken.create({
      data: uniqueEmailResetToken,
    });

    await sendConfirmationEmail({
      userFullName: user.name,
      email: user.email,
      token: emailResetToken.token,
      days: 7,
      type: "emailReset",
    });

    return res
      .status(200)
      .send({ message: "E-mail reset required successfully." });
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const resetEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const emailResetToken = await prisma.emailResetToken.findUnique({
      where: {
        token: token,
      },
    });

    if (!emailResetToken)
      return res.status(400).send({ message: "Invalid token." });

    await prisma.user.update({
      where: {
        cpf_isActive: {
          cpf: emailResetToken.userId,
          isActive: true,
        },
      },
      data: {
        email: emailResetToken.email,
      },
    });

    await prisma.emailResetToken.delete({
      where: {
        token: emailResetToken.token,
      },
    });

    return res.status(200).send({ message: "E-mail reset successfully." });
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const requirePasswordReset = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        cpf_isActive: {
          cpf: userId,
          isActive: true,
        },
      },
    });

    if (!user) return res.status(400).send({ message: "User not found." });

    if (!user.email) throw Error;

    const uniquePasswordResetToken = await getUniquePasswordResetToken({
      userId,
      minutes: 15,
    });

    const passwordResetToken = await prisma.passwordResetToken.create({
      data: uniquePasswordResetToken,
    });

    await sendConfirmationEmail({
      userFullName: user.name,
      email: user.email,
      token: passwordResetToken.token,
      minutes: 15,
      type: "passwordReset",
    });

    return res
      .status(200)
      .send({ message: "Password reset required successfully." });
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!password || password === "")
      return res.status(400).send({ message: "New password not provided." });

    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: {
        token: token,
      },
    });

    if (!passwordResetToken)
      return res.status(400).send({ message: "Invalid token." });

    const encryptedPw = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        cpf_isActive: {
          cpf: passwordResetToken.userId,
          isActive: true,
        },
      },
      data: {
        password: encryptedPw,
      },
    });

    await prisma.passwordResetToken.delete({
      where: {
        token: passwordResetToken.token,
      },
    });

    return res.status(200).send({ message: "Password reset successfully." });
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthCustomRequest;

    const { password, newPassword } = req.body;

    if (!newPassword || newPassword === "")
      return res.status(400).send({ message: "New password not provided." });

    const user = await prisma.user.findUnique({
      where: {
        cpf_isActive: {
          cpf: userId.toString(),
          isActive: true,
        },
      },
    });

    if (!user) return res.status(400).send({ message: "User not found." });

    if (!user.confirmedAccount) {
      return res.status(400).send({
        message: "Account is not confirmed yet.",
        confirmedAccount: false,
      });
    }

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).send({ message: "Incorrect current password." });

    const encryptedPw = await bcrypt.hash(newPassword, 10);

    const response = await prisma.user.update({
      where: {
        cpf_isActive: {
          cpf: userId.toString(),
          isActive: true,
        },
      },
      data: {
        password: encryptedPw,
      },
    });

    if (!response)
      return res.status(400).send({ message: "Something went wrong." });

    return res.status(200).send({ message: "Password updated successfully." });
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const checkConfirmAccountToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const accountConfirmationToken =
      await prisma.accountConfirmationToken.findUnique({
        where: {
          token: token,
        },
      });

    if (!accountConfirmationToken)
      return res.status(400).send({ message: "Token not valid." });

    return res.status(200).send({ message: "Token still valid." });
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};
