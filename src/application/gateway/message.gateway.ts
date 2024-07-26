import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { IUserConversationRepository } from 'src/domain/chat/repository/user-conversation.repository';
import { UserConversationModel } from 'src/domain/chat/models/conversation/user-conversation.model';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger('conversation_socket');
  constructor(
    private readonly userConversationRepository: IUserConversationRepository
  ) {}

  @WebSocketServer() server: Server;
  @SubscribeMessage('uploadProgress')
  async handleSendMessage(client: Socket, payload: any): Promise<void> {
    console.log('sendMessage ahihi', payload);
    this.server.emit('receiveMessage', payload);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRooms(client: Socket, payload: any): Promise<void> {
    if (!payload.roomId) throw new WsException('Bad Request');
    client.join(payload.roomId);
    console.log("client id " + client.id + " joined room " + payload.roomId);
    const userConversation = await this.userConversationRepository.findByUserId(payload.roomId);
    if (userConversation.length > 0) {
      const conversaionIds = userConversation.map((item: UserConversationModel) => item.getConversationId());
      for (const conversationId of conversaionIds) {
        client.join(conversationId);
        console.log("client id " + client.id + " joined room " + conversationId);
      }
    }
  }

  afterInit(server: Server) {
    console.log(server);
    //Do stuffs
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
    //Do stuffs
  }
}