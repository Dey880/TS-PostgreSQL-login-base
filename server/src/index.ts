import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes';
import { homeRoute } from './routes/homeRoute';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use('/api/auth', authRoutes);

app.use('/', homeRoute);

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});