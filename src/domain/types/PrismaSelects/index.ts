import { Prisma } from "@prisma/client";

export const moderatorSelect: Prisma.ModeratorSelect = {
  userId: true,
  user: false,
};

export const medicSelect: Prisma.MedicSelect = {
  userId: true,
  crm: true,
  specialty: true,
  user: false,
  duties: false,
  swapRequests: false,
  receivedSwapReqs: false,
  sentMessages: false,
  receivedMessages: false,
};

export const userSelect: Prisma.UserSelect = {
  cpf: true,
  username: true,
  email: true,
  password: false,
  name: true,
  gender: true,
  role: true,
  phoneNumber: true,
  street: true,
  number: true,
  postalCode: true,
  district: true,
  stateId: true,
  state: true,
  stateAcronym: true,
  cityId: true,
  city: true,
  profilePic: true,
  isActive: false,
  createAt: true,
  updatedAt: true,
  medic: {
    select: medicSelect,
  },
  moderator: {
    select: moderatorSelect,
  },
};
