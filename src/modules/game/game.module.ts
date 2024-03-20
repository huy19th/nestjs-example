import { Module } from '@nestjs/common';
import { SocketModule } from 'src/providers/socket/socket.module';
import { GameGateWay } from './game.gateway';
import { GameService } from './game.service';

@Module({
    imports: [SocketModule],
    providers: [
        GameGateWay,
        GameService,
    ]
})
export class GameModule { }