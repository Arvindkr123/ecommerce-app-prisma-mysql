import express, { Express, NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import { JWT_SECRET } from "../secrets";
import * as jwt from "jsonwebtoken";
import { BadRequestException } from "../exceptions/bad_request.exception";
import { ErrorCode } from "../exceptions/root.exception";
import { UnprocessableEntity } from "../exceptions/validation.exceptions";
import { SignupSchema } from "./../schema/users.scheam";
import { NotFoundException } from "../exceptions/not.found";

export const userLoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
  // now compare the password
  if (!compareSync(password, user?.password)) {
    throw new BadRequestException(
      "Passwords do not match",
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  // now generate the token
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET!
  );
  res.status(200).json({ user, token });
};

export const userSignUpController = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  SignupSchema.parse(req.body);
  let user = await prismaClient.user.findFirst({ where: { email } });

  if (user) {
    new BadRequestException(
      "User already exists",
      ErrorCode.USER_ALREADY_EXISTS
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
};
