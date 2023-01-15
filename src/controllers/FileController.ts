import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
      },
    });

    if (!file) return res.status(400).send({ message: "File not found" });

    res.writeHead(200, {
      "Content-Type": file.contentType,
      "Content-Disposition": `inline; filename=${file.filename}`,
    });
    res.end(file.bytes, "binary");
    return;
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong." });
  }
};
