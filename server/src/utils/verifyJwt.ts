import jwt from 'jsonwebtoken'

export default function verifyJwt(token: string): jwt.JwtPayload | null {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    } catch (error) {
        return null;
    }
};