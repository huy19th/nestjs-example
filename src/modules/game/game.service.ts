import { Injectable } from '@nestjs/common';
import { SocketService } from 'src/providers/socket/socket.service';

@Injectable()
export class GameService {

    private socketService: SocketService;

    setSocketService(socketService: SocketService) {
        this.socketService = socketService;
    }
    
}