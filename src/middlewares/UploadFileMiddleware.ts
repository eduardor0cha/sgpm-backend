import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ErrorResponse, handleErrors } from "../utils/HandleErrorsUtils";
import { removeSpaces, removeSpecialChars } from "../utils/StringUtils";

const storage = multer.memoryStorage();
const prisma = new PrismaClient();

type Props = {
  fieldName: string;
  required: boolean;
  maxSize: number;
};

const storageEngine = multer({ storage: storage });

export function uploadSingleFile({ fieldName, required, maxSize }: Props) {
  const upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file)
        return required
          ? res.status(400).send({ message: `${fieldName} not sent.` })
          : next();

      const file = req.file;

      if (file.size > maxSize)
        return res.status(400).send({ message: "This file is too big!" });

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
      return next();
    } catch (error) {
      const response: ErrorResponse | null = handleErrors(error);
      if (response)
        return res.status(response.code).send({ message: response.message });

      return res.status(500).send({ message: "Something went wrong." });
    }
  };

  return [storageEngine.single(fieldName), upload];
}
