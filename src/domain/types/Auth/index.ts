import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface AuthCustomRequest extends Request {
  userId: string | JwtPayload;
  userRole: string | JwtPayload;
}

export type UserRoles = "moderator" | "medic";
