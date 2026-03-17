import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatRepository: Repository<ChatMessage>,
  ) {}

  async createMessage(userId: number, sender: 'user' | 'admin', message: string, metadata?: any): Promise<ChatMessage> {
    // If admin is sending message to themselves, we might want to flag it or handle it
    const newMessage = this.chatRepository.create({
      userId,
      sender,
      message,
      metadata,
    });
    return await this.chatRepository.save(newMessage);
  }

  async getMessagesByUser(userId: number): Promise<ChatMessage[]> {
    return await this.chatRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
      relations: ['user'],
    });
  }

  async markAsRead(userId: number): Promise<void> {
    await this.chatRepository.update({ userId, isRead: false, sender: 'admin' }, { isRead: true });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await this.chatRepository.count({
      where: { userId, isRead: false, sender: 'admin' },
    });
  }

  async getAllSessions(): Promise<ChatMessage[]> {
    // Get unique user IDs from chat messages
    const userIds = await this.chatRepository
      .createQueryBuilder('chat')
      .select('DISTINCT chat.userId', 'userId')
      .innerJoin('chat.user', 'user')
      .where('user.role = :role', { role: 'customer' }) // Only get customer sessions
      .getRawMany();

    const sessions: ChatMessage[] = [];
    for (const { userId } of userIds) {
      // Get last message and user info
      const lastMessage = await this.chatRepository.findOne({
        where: { userId },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });
      
      if (lastMessage) {
        sessions.push(lastMessage);
      }
    }
    
    // Sort by last message time
    return sessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getMessageById(id: number): Promise<ChatMessage | null> {
    return await this.chatRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
