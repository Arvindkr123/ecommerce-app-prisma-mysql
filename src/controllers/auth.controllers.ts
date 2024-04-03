import express, { Express, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import { JWT_SECRET } from "../secrets";
import * as jwt from "jsonwebtoken";

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

export const userSignUpController = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    let user = await prismaClient.user.findFirst({ where: { email } });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });

    res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
