import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Namespace, Socket } from 'socket.io';
import { SocketService } from 'src/providers/socket/socket.service';
import { GameService } from './game.service';
import { GameEvent } from './game.constant';
import { SendMessageDto } from './game.interface';
import { UserSocket } from '../user/user.interface';

@UsePipes(ValidationPipe)
@WebSocketGateway(
    // 8000, // default server port if not specified
    { // connect options
        namespace: '/game',
        cors: { origin: "*" }
    }
)
export class GameGateWay implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private socketService: SocketService,
        private gameService: GameService,
    ) { }

    @WebSocketServer() // server is instance of Namespace because namespace was specified in @WebSocketGateway
    private readonly server: Namespace;

    afterInit() {
        this.server.use(this.socketService.verifyClient.bind(this.socketService));
        this.server.use(this.socketService.disconnectPreviouslyConnectedSocket.bind(this.socketService));
        this.socketService.setServer(this.server);
        this.gameService.setSocketService(this.socketService);
    }

    handleConnection(socket: Socket) {
        // this.socketService.handleConnection(socket);
    }

    handleDisconnect(socket: Socket) {
        this.socketService.handleDisconnect(socket);
    }

    @SubscribeMessage(GameEvent.UserInfo)
    async sendUserInfo(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: null,
    ) {
        const user: UserSocket = await this.socketService.getUserSocket(socket.data.userId);
        socket.emit(GameEvent.UserInfo, user);
        // return user; // respone in acknowledgement style
    }

    @SubscribeMessage(GameEvent.SendMessage)
    async sendMessage(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: SendMessageDto,
    ) {
        const user: UserSocket = await this.socketService.getUserSocket(socket.data.userId);
        socket.to(user.socketId).emit(GameEvent.SendMessage, data.message);
        // this.socketService.emit(GameEvent.SendMessage, data.message, user.socketId);
    }

}
