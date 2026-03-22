// src/orders/orders.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173', credentials: true },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`� Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  // เรียกจาก Service เมื่อ order status เปลี่ยน
  emitOrderUpdate(order: any) {
    this.server.emit('orderUpdated', order);
  }

  // เรียกเมื่อยกเลิก order
  emitOrderCancelled(order: any) {
    this.server.emit('orderCancelled', order);
  }

  // เรียกเมื่อคืนเงินสำเร็จ
  emitRefundProcessed(order: any) {
    this.server.emit('refundProcessed', order);
  }
}
