import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ErrorResponse, handleErrors } from "../utils/HandleErrorsUtils";
import bcrypt from "bcrypt";
import { userSelect } from "../prismaSelects";
import jwt from "jsonwebtoken";

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

    if (userByEmail) {
    }

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
      return res.send({ message: "Username, email, or password are invalid." });

    if (!(await bcrypt.compare(password, user.password)))
      return res.send({ message: "Username, email, or password are invalid." });

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
