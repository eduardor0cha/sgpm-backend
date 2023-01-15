import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ErrorResponse, handleErrors } from "../utils/HandleErrorsUtils";
import { removeSpaces, removeSpecialChars } from "../utils/StringUtils";

const storage = multer.memoryStorage();
const prisma = new PrismaClient();

export const storeEngine = multer({ storage: storage });

export const uploadSingleFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) return res.status(400).send({ message: "File not sent." });

    const file = req.file;

    if (file.size > 5242880)
      return res
        .status(400)
        .send({ message: "This file is too big! The maximum limit is 5MB." });

    const fileId = `${Date.now()}-sgpm-database-${removeSpecialChars(
      removeSpaces(file.originalname)
    ).toLowerCase()}`;

    await prisma.file.create({
      data: {
        id: fileId,
        filename: removeSpecialChars(file.originalname),
        bytes: file.buffer,
        contentType: file.mimetype,
        size: file.size,
      },
    });

    if (!file) throw Error;

    res.locals.fileId = fileId;
    next();
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};
