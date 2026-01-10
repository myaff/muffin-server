import { Request } from 'express';
import { JwtObjectAccess } from 'src/auth/auth.model';

export type UserRequest = Request & { user: JwtObjectAccess };
