import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    WsException,
} from '@nestjs/websockets';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@UsePipes(ValidationPipe)
@WebSocketGateway(
    // 8000, // default server port if not specified
    { // connect options
        cors: { origin: "*" }
    }
)
export class SocketGateWay implements OnGatewayInit {

    constructor() { }

    @WebSocketServer()
    private readonly server: Server;

    afterInit() {
        // disable default namespace
        this.server.use((socket: Socket, next: Function) => {
            next(new WsException('Not found'));
        });
    }

}