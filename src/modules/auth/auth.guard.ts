import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/providers/token/token.service';
import { IS_PUBLIC_KEY } from './public.decorator';
import { Reflector } from '@nestjs/core';
import { AccessTokenPayload } from './auth.interface';
import { CacheService } from 'src/providers/cache/cache.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private tokenService: TokenService,
        private reflector: Reflector,
        private cacheService: CacheService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const request: Request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException();

        const decoded: AccessTokenPayload = await this.tokenService.verifyJwt(token);
        const cachedToken: string = await this.cacheService.redis.get<string>(decoded.key);
        if (!cachedToken || cachedToken !== token) throw new UnauthorizedException();
        request['userId'] = decoded._id;
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}