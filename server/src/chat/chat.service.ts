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

  async createMessage(userId: number, sender: 'user' | 'admin', message: string): Promise<ChatMessage> {
    const newMessage = this.chatRepository.create({
      userId,
      sender,
      message,
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
}
