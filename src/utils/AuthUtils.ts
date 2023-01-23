import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export const getUniqueAccountConfirmationToken = async (props: {
  userId: string;
  minutes?: number;
  hours?: number;
  days?: number;
}): Promise<Prisma.AccountConfirmationTokenCreateInput> => {
  const response = await prisma.accountConfirmationToken.findUnique({
    where: {
      userId: props.userId,
    },
  });

  if (response) {
    await prisma.accountConfirmationToken.delete({
      where: {
        userId: props.userId,
      },
    });
  }

  let isUnique = false;
  let token = "";
  do {
    token = crypto.randomBytes(32).toString("hex");
    const tokenResponse = await prisma.accountConfirmationToken.findUnique({
      where: {
        token: token,
      },
    });

    if (!tokenResponse) {
      isUnique = true;
      continue;
    }

    const now = new Date();
    if (tokenResponse.expiresAt < now) {
      await prisma.accountConfirmationToken.delete({
        where: {
          token: tokenResponse.token,
        },
      });

      isUnique = true;
      continue;
    }

    isUnique = false;
  } while (!isUnique);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + (props.minutes || 0));
  expiresAt.setHours(expiresAt.getHours() + (props.hours || 0));
  expiresAt.setDate(expiresAt.getDate() + (props.days || 0));

  return {
    user: {
      connect: {
        cpf: props.userId,
      },
    },
    token: token,
    expiresAt: expiresAt,
  };
};

export const getUniqueEmailResetToken = async (props: {
  userId: string;
  email: string;
  minutes?: number;
  hours?: number;
  days?: number;
}): Promise<Prisma.EmailResetTokenCreateInput> => {
  const response = await prisma.emailResetToken.findUnique({
    where: {
      userId: props.userId,
    },
  });

  if (response) {
    await prisma.emailResetToken.delete({
      where: {
        userId: props.userId,
      },
    });
  }

  let isUnique = false;
  let token = "";
  do {
    token = crypto.randomBytes(32).toString("hex");
    const tokenResponse = await prisma.emailResetToken.findUnique({
      where: {
        token: token,
      },
    });

    if (!tokenResponse) {
      isUnique = true;
      continue;
    }

    const now = new Date();
    if (tokenResponse.expiresAt < now) {
      await prisma.emailResetToken.delete({
        where: {
          token: tokenResponse.token,
        },
      });

      isUnique = true;
      continue;
    }

    isUnique = false;
  } while (!isUnique);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + (props.minutes || 0));
  expiresAt.setHours(expiresAt.getHours() + (props.hours || 0));
  expiresAt.setDate(expiresAt.getDate() + (props.days || 0));

  return {
    user: {
      connect: {
        cpf: props.userId,
      },
    },
    token: token,
    email: props.email,
    expiresAt: expiresAt,
  };
};

export const getUniquePasswordResetToken = async (props: {
  userId: string;
  minutes?: number;
  hours?: number;
  days?: number;
}): Promise<Prisma.PasswordResetTokenCreateInput> => {
  const response = await prisma.passwordResetToken.findUnique({
    where: {
      userId: props.userId,
    },
  });

  if (response) {
    await prisma.passwordResetToken.delete({
      where: {
        userId: props.userId,
      },
    });
  }

  let isUnique = false;
  let token = "";
  do {
    token = crypto.randomBytes(3).toString("hex").toUpperCase();
    const tokenResponse = await prisma.passwordResetToken.findUnique({
      where: {
        token: token,
      },
    });

    if (!tokenResponse) {
      isUnique = true;
      continue;
    }

    const now = new Date();
    if (tokenResponse.expiresAt < now) {
      await prisma.passwordResetToken.delete({
        where: {
          token: tokenResponse.token,
        },
      });

      isUnique = true;
      continue;
    }

    isUnique = false;
  } while (!isUnique);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + (props.minutes || 0));
  expiresAt.setHours(expiresAt.getHours() + (props.hours || 0));
  expiresAt.setDate(expiresAt.getDate() + (props.days || 0));

  return {
    user: {
      connect: {
        cpf: props.userId,
      },
    },
    token: token,
    expiresAt: expiresAt,
  };
};
