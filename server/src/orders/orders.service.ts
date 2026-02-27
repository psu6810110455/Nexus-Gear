import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // ฟังก์ชันสร้าง Order (ใช้สำหรับ Mock Data หรือ User สั่งซื้อจริง)
  async create(createOrderDto: CreateOrderDto) {
    const { userId, shippingAddress, items } = createOrderDto;

    // 1. หา User
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    // 2. เตรียม Order
    const order = new Order();
    order.user = user;
    order.shipping_address = shippingAddress;
    order.status = OrderStatus.PENDING;
    order.items = [];
    
    let totalPrice = 0;

    // 3. Loop สร้าง Order Items และคำนวณราคา
    for (const itemDto of items) {
      const product = await this.productsRepository.findOneBy({ id: itemDto.productId });
      if (!product) {
        throw new NotFoundException(`ไม่พบสินค้า Product ID: ${itemDto.productId}`);
      }

      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.quantity = itemDto.quantity;
      orderItem.price_at_purchase = product.price;
      
      totalPrice += Number(product.price) * itemDto.quantity;
      order.items.push(orderItem);
    }

    order.total_price = totalPrice;

    return this.ordersRepository.save(order);
  }

  findAll() {
    return this.ordersRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: { created_at: 'DESC' },
    });
  }

  // ... (ต่อจาก findAll)

  // 1. ฟังก์ชันเปลี่ยนสถานะ (Update Status)
  async updateStatus(id: number, status: OrderStatus) {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) throw new NotFoundException('Order not found'); // อย่าลืม import NotFoundException ด้านบนสุด

    order.status = status;
    return this.ordersRepository.save(order);
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } }, // ค้นหาเฉพาะของ user คนนี้
      relations: ['items', 'items.product', 'user'], // ดึงข้อมูลสินค้าที่สั่งมาด้วย
      order: {
        created_at: 'DESC', // เรียงจากออเดอร์ล่าสุด
      },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`ไม่พบคำสั่งซื้อหมายเลข ${id}`);
    }

    return order;
  }
}