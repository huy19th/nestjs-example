import { Module } from '@nestjs/common';
import { TokenModule } from 'src/providers/token/token.module';
import { CacheModule } from 'src/providers/cache/cache.module';
import { UserModule } from 'src/modules/user/user.module';
import { SocketService } from './socket.service';
import { SocketGateWay } from './socket.gateway';

@Module({
    imports: [
        TokenModule,
        CacheModule,
        UserModule,
    ],
    providers: [SocketService, SocketGateWay],
    exports: [SocketService]
})
export class SocketModule { }