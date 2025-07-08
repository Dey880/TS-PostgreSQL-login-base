import jwt from 'jsonwebtoken';

import { Role } from '@prisma/client';

export default function createJwt(email: string, username: string, role: Role, id: number): string {
    const jwtToken = jwt.sign({email, username, role, id}, process.env.JWT_SECRET!);
    return jwtToken;
};