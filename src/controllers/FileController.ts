import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ErrorResponse, handleErrors } from "../utils/HandleErrorsUtils";

const prisma = new PrismaClient();

export const getFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.file.findUniqueOrThrow({
      where: {
        id_isActive: {
          id: fileId,
          isActive: true,
        },
      },
    });

    res.writeHead(200, {
      "Content-Type": file.contentType,
      "Content-Disposition": `inline; filename=${file.filename}`,
    });
    res.end(file.bytes, "binary");
    return;
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;

    await prisma.file.update({
      where: {
        id_isActive: {
          id: fileId,
          isActive: true,
        },
      },
      data: {
        isActive: false,
      },
    });

    return res.status(200).send({ message: "File deleted successfully." });
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};
