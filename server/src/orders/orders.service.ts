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
      if (!product) continue; 

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

  // 2. ฟังก์ชันเสกข้อมูล (Seed)
  async seed() {
    // สร้าง User จำลอง
    let user = await this.usersRepository.findOneBy({ id: 1 });
    if (!user) {
      user = this.usersRepository.create({
        email: 'admin@nexusgear.com',
        password: 'hash-password',
        name: 'AdminNexus',
        role: 'admin'
      });
      await this.usersRepository.save(user);
    }

    // สร้าง Product จำลอง
    const productNames = [
      { name: 'Razer Kishi V2', price: 3490 },
      { name: 'Logitech G Pro X', price: 4590 },
      { name: 'Keychron Q1 Pro', price: 7290 },
    ];

    for (const p of productNames) {
      const exists = await this.productsRepository.findOneBy({ name: p.name });
      if (!exists) {
        await this.productsRepository.save({
          name: p.name,
          description: 'Gaming Gear High End',
          price: p.price,
        });
      }
    }

    // สร้าง Order จำลอง
    const products = await this.productsRepository.find();
    const statuses = [
      OrderStatus.PENDING,
      OrderStatus.PAID,
      OrderStatus.SHIPPED,
      OrderStatus.TO_SHIP,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELLED,
    ];

    for (let i = 0; i < 10; i++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const order = new Order();
      order.user = user;
      order.shipping_address = '99/9 ถ.พหลโยธิน จตุจักร กทม. 10900';
      order.status = randomStatus;
      order.total_price = randomProduct.price; 
      
      const item = new OrderItem();
      item.product = randomProduct;
      item.quantity = 1;
      item.price_at_purchase = randomProduct.price;

      order.items = [item];
      await this.ordersRepository.save(order);
    }

    return { message: 'Mock data created successfully! 🚀' };
  }
}