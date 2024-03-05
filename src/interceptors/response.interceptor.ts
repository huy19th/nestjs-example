import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // add meta data to response
        return next.handle().pipe(
            map((data) => ({
                meta: {
                    status: 'success',
                    message: 'Operation successful',
                    timestamp: new Date().toISOString(),
                },
                data,
            })
            ),
            catchError((err) => {
                if (err instanceof HttpException) {
                    // Convert to a standard error format
                    throw err;
                }
                if (err instanceof Error) {
                    // Convert to a standard error format
                    throw new HttpException(err.message, 500);
                } else {
                    throw throwError(err);
                }
            }),
        );
    }
}