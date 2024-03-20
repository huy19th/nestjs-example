import { Injectable, Scope } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Server, Namespace, Socket } from 'socket.io';
import { TokenService } from 'src/providers/token/token.service';
import { CacheService } from 'src/providers/cache/cache.service';
import { UserService } from 'src/modules/user/user.service';
import { AccessTokenPayload } from 'src/modules/auth/auth.interface';
import { UserDocument } from 'src/modules/user/user.schema';
import { Logger } from '@nestjs/common';
import { UserSocket } from 'src/modules/user/user.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class SocketService {

    private logger: Logger;
    private server: Server | Namespace;
    private nsp: string;

    constructor(
        private tokenService: TokenService,
        private cacheService: CacheService,
        private userService: UserService,
    ) { }

    setServer(server: Server | Namespace) {
        this.server = server;
        this.nsp = server instanceof Server ? 'SocketServer' : server.name;
        this.logger = new Logger(
            server instanceof Server ? SocketService.name : server.name,
            { timestamp: true }
        );
    }

    async verifyClient(socket: Socket, next: Function) {
        try {
            // const token: string = socket.handshake.auth['accessToken'] as string;
            const token: string = socket.handshake.query['accessToken'] as string;
            if (!token) throw Error('Unauthorized');
            const decoded: AccessTokenPayload = await this.tokenService.verifyJwt(token);
            const cachedToken: string = await this.cacheService.redis.get<string>(decoded.key);
            if (!cachedToken || cachedToken !== token) throw Error('Unauthorized');
            socket.data.userId = decoded._id;
            next();
        }
        catch (err) {
            this.logger.error(err);
            next(new WsException('Unauthorized'));
        }
    }

    async disconnectPreviouslyConnectedSocket(socket: Socket, next: Function) {
        try {
            const user: UserSocket = await this.getUserSocket(socket.data.userId);
            if (user && user.socketId != socket.id) {
                this.disconnectSocket(user.socketId);
            }
        }
        catch (err) {
            this.logger.error(err);
        }
        finally {
            next();
        }
    }

    async handleConnection(socket: Socket) {
        const user: UserDocument = await this.userService.findUserById(socket['userId']);
        this.cacheService.redis.set(
            `${socket.nsp.name}-${socket['userId']}`,
            {
                _id: socket['userId'],
                username: user.username,
                socketId: socket.id
            }
        );
    }

    async handleDisconnect(socket: Socket) {
        this.cacheService.redis.del(`${socket.nsp.name}-${socket['userId']}`);
    }

    getUserSocket(userId: string): Promise<UserSocket> {
        return this.cacheService.redis.get(`${this.nsp}-${userId}`);
    }

    joinRoom(socketId: string, roomId: string) {
        this.server.in(socketId).socketsJoin(roomId);
    }

    leaveRoom(socketId: string, roomId: string) {
        this.server.in(socketId).socketsLeave(roomId);
    }

    disconnectSocket(socketId: string, close?: boolean) {
        this.server.in(socketId).disconnectSockets(close);
    }

    /** 
     * @param socketId can be a socket id, room id or list of room or socket id
     * the same goes with @param exceptId
    */
    emit(event: string, data: any, socketId: string | string[], exceptId?: string | string[]) {
        if (exceptId) {
            this.server.to(socketId).emit(event, data);
        }
        else {
            this.server.to(socketId).except(exceptId).emit(event, data);
        }
    }

    async emitWithAck<T>(event: string, data: any, socketId: string): Promise<T> {
        try {
            const responses = await this.server.timeout(3000).to(socketId).emitWithAck(event, data);
            return responses;
        }
        catch (err) {
            return null;
        }
    }
}