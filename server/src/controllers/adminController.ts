import express, { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';

import verifyJwt from '../utils/verifyJwt';

const prisma = new PrismaClient();

export const adminController = {
    promote: async (req: Request, res: Response) => {
        try {
            const { email } = req.params;
            const emailLower = email.toLowerCase();
            const token = req.cookies.jwt;
            if(!token) return res.status(401).send({ message: 'No Token Provided' });
            const decoded = verifyJwt(token);
            if(!decoded) return res.status(401).send({ message: 'Invalid Token' });
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (user?.role !== 'ADMIN') return res.status(403).send({ message: 'Not An Admin' });
            const update = await prisma.user.update({
                where: {
                    email: emailLower,
                },
                data: {
                    role: Role.ADMIN,
                }
            });
            res.status(200).send({ message: 'User Updated' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    },
    demote: async (req: Request, res: Response) => {
        try {
            const { email } = req.params;
            const emailLower = email.toLowerCase();
            const token = req.cookies.jwt;
            if(!token) return res.status(401).send({ message: 'No Token Provided' });
            const decoded = verifyJwt(token);
            if(!decoded) return res.status(401).send({ message: 'Invalid Token' });
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (user?.role !== 'ADMIN') return res.status(403).send({ message: 'Not An Admin' });
            const update = prisma.user.update({
                where: {
                    email: emailLower,
                },
                data: {
                    role: Role.USER,
                }
            });
            res.status(200).send({ message: 'User Updated' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    },
    getAdmins: async (req: Request, res: Response) => {
        try {
            const token = req.cookies.jwt;
            if(!token) return res.status(401).send({ message: 'No Token Provided' });
            const decoded = verifyJwt(token);
            if(!decoded) return res.status(401).send({ message: 'Invalid Token' });
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (user?.role !== Role.ADMIN) return res.status(403).send({ message: 'Not An Admin' });
            const admins = await prisma.user.findMany({
                where: {
                    role: Role.ADMIN,
                },
            });
            if(!admins) return res.status(404).send({ message: 'No Admins Found' });
            res.status(200).send({ admins });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}