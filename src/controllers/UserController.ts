import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { ErrorResponse, handleErrors } from "../utils/HandleErrorsUtils";
import { userSelect } from "../domain/types/PrismaSelects";
import bcrypt from "bcrypt";
import { findCityById } from "../services/IBGE/IBGEAPI";
import { AuthCustomRequest } from "../domain/types/Auth";
import {
  getUniqueAccountConfirmationToken,
  getUniqueEmailResetToken,
} from "../utils/AuthUtils";
import { sendConfirmationEmail } from "../utils/EmailSender";
import City from "../domain/models/City";

const prisma = new PrismaClient();

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { cpf } = req.params;

    await prisma.user.update({
      where: {
        cpf_isActive: {
          cpf: cpf,
          isActive: true,
        },
      },
      data: {
        isActive: false,
      },
    });

    return res.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId, userRole } = req as AuthCustomRequest;
    const { cpf } = req.params;

    if (userRole != "moderator" && userId != cpf)
      return res.status(401).send({ message: "User not allowed." });

    const fileId = res.locals.fileId;

    const {
      username,
      email,
      name,
      phoneNumber,
      street,
      number,
      postalCode,
      district,
      cityId,
    } = req.body;

    let city: City | undefined;
    if (cityId) {
      city = await findCityById(Number(cityId));
    }

    const user = await prisma.user.update({
      where: {
        cpf_isActive: {
          cpf: cpf,
          isActive: true,
        },
      },
      data: {
        username: username,
        name: name,
        phoneNumber: phoneNumber,
        street: street,
        number: number,
        postalCode: postalCode,
        district: district,
        cityId: city ? city.id : undefined,
        city: city ? city.name : undefined,
        stateId: city ? city.stateId : undefined,
        state: city ? city.state : undefined,
        stateAcronym: city ? city.stateAcronym : undefined,
        profilePic: fileId,
      },
      select: userSelect,
    });

    if (email) {
      const emailResetToken = await getUniqueEmailResetToken({
        userId: cpf,
        days: 7,
        email: email,
      });

      const uniqueEmailResetToken = await prisma.emailResetToken.create({
        data: emailResetToken,
      });

      if (!user.name) throw Error;

      await sendConfirmationEmail({
        token: uniqueEmailResetToken.token,
        userFullName: user.name,
        email: email,
        days: 7,
        type: "emailReset",
      });
    }

    return res.status(200).send(user);
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      cpf,
      username,
      email,
      password,
      name,
      gender,
      role,
      phoneNumber,
      street,
      number,
      postalCode,
      district,
      cityId,
      crm,
      specialty,
    } = req.body;

    const medicData: Prisma.MedicCreateNestedOneWithoutUserInput | undefined =
      role != "medic"
        ? undefined
        : {
            create: {
              crm: crm,
              specialty: specialty,
            },
          };

    const moderatorData:
      | Prisma.ModeratorCreateNestedOneWithoutUserInput
      | undefined =
      role != "moderator"
        ? undefined
        : {
            create: {},
          };

    if (!medicData && !moderatorData)
      return res.status(400).send({ message: "User has not a valid role." });

    const city = await findCityById(Number(cityId));

    if (!city) return res.status(400).send({ message: "Invalid city id." });

    const encryptedPw = await bcrypt.hash(password, 10);

    const confirmAccountToken = await getUniqueAccountConfirmationToken({
      userId: cpf,
      days: 7,
    });

    const user = await prisma.user.create({
      data: {
        cpf: cpf,
        username: username,
        email: email,
        password: encryptedPw,
        name: name,
        gender: gender,
        role: role,
        phoneNumber: phoneNumber,
        street: street,
        number: number,
        postalCode: postalCode,
        district: district,
        cityId: city.id,
        city: city.name,
        stateId: city.stateId,
        state: city.state,
        stateAcronym: city.stateAcronym,
        medic: medicData,
        moderator: moderatorData,
        confirmAccountToken: {
          create: {
            token: confirmAccountToken.token,
            createAt: confirmAccountToken.createAt,
            updatedAt: confirmAccountToken.updatedAt,
            expiresAt: confirmAccountToken.expiresAt,
          },
        },
      },
      select: userSelect,
    });

    if (!user.email) throw Error;
    if (!user.name) throw Error;

    await sendConfirmationEmail({
      token: confirmAccountToken.token,
      userFullName: user.name,
      email: user.email,
      days: 7,
      type: "accountConfirmation",
    });

    return res.status(200).send(user);
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};

export const findUserById = async (req: Request, res: Response) => {
  try {
    const { cpf } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        cpf_isActive: {
          cpf: cpf,
          isActive: true,
        },
      },
      select: userSelect,
    });

    if (!user) return res.status(400).send({ message: "User not found." });

    return res.status(200).send(user);
  } catch (error) {
    const response: ErrorResponse | null = handleErrors(error);
    if (response)
      return res.status(response.code).send({ message: response.message });

    return res.status(500).send({ message: "Something went wrong." });
  }
};
