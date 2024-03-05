import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {

    constructor(private readonly configService: ConfigService) { }

    signJwt(payload: string | object | Buffer, expiresIn: string): string {
        return jwt.sign(
            payload,
            this.configService.get<Configuration['security']['jwtSecret']>('security.jwtSecret'),
            { expiresIn }
        )
    }

    verifyJwt<T>(token: string): T {
        try {
            return (jwt.verify(token, this.configService.get<string>('security.jwtSecret'))) as T;
        }
        catch (err) {
            throw new UnauthorizedException();
        }
    }
}