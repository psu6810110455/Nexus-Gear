import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // Normalize message dates: convert createdAt to a Bangkok-local ISO string
  // This ensures the client receives a string that parses as Bangkok time consistently
  private normalizeMsg(msg: any): any {
    if (!msg) return msg;
    const normalized = { ...msg };
    if (normalized.createdAt) {
      let d: Date;
      if (normalized.createdAt instanceof Date) {
        d = normalized.createdAt;
      } else {
        d = new Date(normalized.createdAt);
      }
      
      if (!isNaN(d.getTime())) {
        // Format as Bangkok time ISO string (YYYY-MM-DDTHH:MM:SS+07:00)
        const bangkokStr = d.toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' });
        // sv-SE locale gives "YYYY-MM-DD HH:MM:SS" format
        normalized.createdAt = bangkokStr.replace(' ', 'T') + '+07:00';
      }
    }
    // Remove circular references from user relation if present
    if (normalized.user) {
      normalized.user = { ...normalized.user };
      delete normalized.user.chatMessages;
    }
    return normalized;
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  async handleJoin(@MessageBody() data: { userId: number }, @ConnectedSocket() client: Socket) {
    client.join(`user_${data.userId}`);
    const messages = await this.chatService.getMessagesByUser(data.userId);
    client.emit('messageHistory', messages.map(m => this.normalizeMsg(m)));
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { userId: number; sender: 'user' | 'admin'; message: string; metadata?: any },
  ) {
    console.log(`Received message from ${data.sender} for user ${data.userId}: ${data.message}`);
    const savedMessage = await this.chatService.createMessage(data.userId, data.sender, data.message, data.metadata);
    
    const normalizedMessage = this.normalizeMsg(savedMessage);
    // Broadcast to user room and admin room (if any)
    this.server.to(`user_${data.userId}`).emit('newMessage', normalizedMessage);
    this.server.emit('adminNewMessage', normalizedMessage); // For admin dashboard
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { userId: number; sender: 'user' | 'admin'; isTyping: boolean },
  ) {
    // Broadcast typing status to the relevant room
    if (data.sender === 'user') {
      this.server.emit('adminTyping', data);
    } else {
      this.server.to(`user_${data.userId}`).emit('typing', data);
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(@MessageBody() data: { userId: number }) {
    await this.chatService.markAsRead(data.userId);
    const unreadCount = await this.chatService.getUnreadCount(data.userId);
    this.server.to(`user_${data.userId}`).emit('unreadUpdated', { count: unreadCount });
  }

  @SubscribeMessage('adminGetAllSessions')
  async handleAdminGetAllSessions(@ConnectedSocket() client: Socket) {
    const sessions = await this.chatService.getAllSessions();
    client.emit('adminSessionsHistory', sessions.map(m => this.normalizeMsg(m)));
  }

  // Method to be called from other services (e.g. OrdersService)
  async sendSystemMessage(userId: number, message: string) {
    const savedMessage = await this.chatService.createMessage(userId, 'admin', message);
    this.server.to(`user_${userId}`).emit('newMessage', this.normalizeMsg(savedMessage));
  }
}
