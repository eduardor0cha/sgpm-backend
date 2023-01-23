import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { AuthCustomRequest, UserRoles } from "../domain/types/Auth";

type Props = {
  allowedRoles: "all" | UserRoles[];
};

export default ({ allowedRoles }: Props) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers.authorization;

      if (!authorization)
        return res.status(401).send({ message: "No token provided." });
      if (!authorization.startsWith("Bearer "))
        return res
          .status(401)
          .send({ message: "Token malformatted, expired or invalid." });
      if (!(authorization.split(" ").length == 2))
        return res
          .status(401)
          .send({ message: "Token malformatted, expired or invalid." });

      const token = authorization.split(" ")[1];

      jwt.verify(token, process.env.JWT_KEY as Secret, (err, decoded) => {
        if (err)
          return res
            .status(401)
            .send({ message: "Token malformatted, expired or invalid." });

        if (!decoded) throw Error;

        const userId = (decoded as JwtPayload)["cpf"];
        const userRole = (decoded as JwtPayload)["role"];

        if (allowedRoles != "all" && !allowedRoles.includes(userRole))
          return res.status(401).send({ message: "User role not allowed." });

        (req as AuthCustomRequest).userId = userId;
        (req as AuthCustomRequest).userRole = userRole;
        next();
      });
    } catch (err) {
      return res.status(500).send({ message: "Something went wrong." });
    }
  };
};
