import { Request } from 'express';

export class JwtPayload {
  sub: string; // User's id (standard JWT)
  username: string;
  iat?: number; // Issued at (created by JWT)
  exp?: number; // Expiration time (created by JWT)
}

export interface JwtRequest extends Request {
  user: JwtPayload;
}
