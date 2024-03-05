import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimeExeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        const req: Request = context.switchToHttp().getRequest();
        const start = Date.now();

        return next
            .handle()
            .pipe(
                tap(() => {
                    const duration = Date.now() - start;
                    if (duration > 100) {
                        Logger.log(
                            `${req.method}: ${req.path}: +${duration}ms`,
                            context.getClass().name
                        );
                    }
                }),
            );
    }
}