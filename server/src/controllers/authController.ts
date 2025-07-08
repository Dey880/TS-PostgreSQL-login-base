import express, { Request, Response } from 'express';
import { PrismaClient, Role  } from '@prisma/client';
import argon2 from 'argon2';

import createCookie from '../utils/createCookie';
import createJwt from '../utils/createJwt';
import verifyJwt from '../utils/verifyJwt';

const prisma = new PrismaClient();


export const authController = {
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const emailLower = email.toLowerCase();

            const user = await prisma.user.findUnique({
                where: {email: emailLower}
            });
            if (!user) return res.status(404).send({ message: 'User Not Found' });
            const isValid = await argon2.verify(user.password, password);
            if (!isValid) return res.status(401).send({ message: 'Email or Password Incorrect' });

            const jwtToken = createJwt(user.email, user.username, user.role, user.id);
            createCookie(res, jwtToken);
            res.status(200).send({ message: 'Successfully Logged In' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    },
    register: async (req: Request, res: Response) => {
        try {
            const { email, username, password, repeatPassword } = req.body;
            const emailLower = email.toLowerCase();
            const role = Role.USER;
            
            const taken = await prisma.user.findUnique({
                where: { email: emailLower },
            });

            if (taken) return res.status(409).send({ message: 'Email already in use' });
            if (password !== repeatPassword) return res.status(400).send({ message: 'Passwords do not match' });
            const hash = await argon2.hash(password);

            const user = await prisma.user.create({
                data: { email: emailLower, username, password: hash, role },
            });
            const jwtToken = createJwt(emailLower, username, role, user.id);
            createCookie(res, jwtToken);

            res.status(201).send({ message: 'User Successfully Created', user });
            
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    },
    getuser: async (req: Request, res: Response) => {
        try {
            const token = req.cookies.jwt;
            if (!token) return res.status(401).send({ message: 'No Token Provided' });
            try {
                const decoded = verifyJwt(token);
                if (!decoded) return res.status(401).send({ message: 'Invalid Token' });
                const user = await prisma.user.findUnique({
                    where: { id: decoded.id },
                });
                if (!user) return res.status(404).send({ message: 'User Not Found' });
                res.status(200).send({ message: 'User Found', user });
            } catch (error) {
                console.error(error);
                res.status(401).send({ message: 'Invalid Token' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    },
    logout: (req: Request, res: Response) => {
        try {
            res.cookie('jwt', '', {
                httpOnly: true,
                expires: new Date(0),
            });
            res.status(200).send({ message: 'Successfully logged out' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
};