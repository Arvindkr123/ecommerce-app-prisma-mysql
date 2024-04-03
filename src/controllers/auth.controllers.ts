import express, { Express, NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import { JWT_SECRET } from "../secrets";
import * as jwt from "jsonwebtoken";
import { BadRequestException } from "../exceptions/bad_request.exception";
import { ErrorCode } from "../exceptions/root.exception";
import { UnprocessableEntity } from "../exceptions/validation.exceptions";
import { SignupSchema } from "./../schema/users.scheam";

export const userLoginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // now compare the password
    if (!compareSync(password, user.password)) {
      return res.status(404).json({ error: "Passwords does not match" });
    }

    // now generate the token
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET!
    );
    res.status(200).json({ user, token });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const userSignUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name } = req.body;
  try {
    SignupSchema.parse(req.body);
    let user = await prismaClient.user.findFirst({ where: { email } });

    if (user) {
      next(
        new BadRequestException(
          "User already exists",
          ErrorCode.USER_ALREADY_EXISTS
        )
      );
    }

    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });

    res.status(201).json(user);
  } catch (error: any) {
    next(
      new UnprocessableEntity(
        error?.issues,
        "UnprocessableEntity",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};
