import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export type ErrorResponse = {
  code: number;
  message: string;
};

export const handleErrors = (error: any): ErrorResponse | null => {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2025":
        return {
          message: "Object not found.",
          code: 400,
        };
    }
  }
  return null;
};
