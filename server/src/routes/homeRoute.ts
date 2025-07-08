import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const homeRoute = express.Router();

homeRoute.get('/', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
                password: true,
                role: true,
            },
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    };
});