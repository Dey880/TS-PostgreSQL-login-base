import { Response } from 'express';

export default function createCookie(res: Response, jwtToken: string): void {
    res.cookie('jwt', jwtToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
    });
};