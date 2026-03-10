import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Cart } from '../cart/entities/cart.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  // ── Checkout จากตะกร้า (จาก feature branch) ──────────────────────────────
  async checkout(
    userId: number,
    shippingAddress: string,
    paymentMethod: string,
    slipImage: string | null,
  ) {
    // 1. ดึงสินค้าในตะกร้าของ user
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException('ตะกร้าสินค้าว่างเปล่า ไม่สามารถสั่งซื้อได้');
    }

    // 2. หา User
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    // 3. คำนวณราคารวมและสร้าง Order Items
    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    for (const cartItem of cartItems) {
      const product = await this.productsRepository.findOneBy({ id: cartItem.product.id });
      if (!product) {
        throw new NotFoundException(`ไม่พบสินค้า Product ID: ${cartItem.product.id}`);
      }

      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.quantity = cartItem.quantity;
      orderItem.price_at_purchase = product.price;

      totalPrice += Number(product.price) * cartItem.quantity;
      orderItems.push(orderItem);

      // ตัดสต็อก
      product.stock -= cartItem.quantity;
      await this.productsRepository.save(product);
    }

    // 4. สร้าง Order
    const order = new Order();
    order.user = user;
    order.shipping_address = shippingAddress;
    order.status = OrderStatus.PENDING;
    order.total_price = totalPrice;
    order.slip_image = slipImage;
    order.order_number = 'ORD-' + Date.now();
    order.items = orderItems;

    const savedOrder = await this.ordersRepository.save(order);

    // 5. ล้างตะกร้า
    await this.cartRepository.delete({ user: { id: userId } });

    return {
      success: true,
      message: 'สั่งซื้อและตัดสต็อกสินค้าสำเร็จ!',
      orderId: savedOrder.id,
      orderNumber: savedOrder.order_number,
      totalAmount: totalPrice,
    };
  }

  // ── Create Order แบบ manual (จาก HEAD) ───────────────────────────────────
  async create(createOrderDto: CreateOrderDto) {
    const { userId, shippingAddress, items } = createOrderDto;

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const order = new Order();
    order.user = user;
    order.shipping_address = shippingAddress;
    order.status = OrderStatus.PENDING;
    order.items = [];

    let totalPrice = 0;

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

  // ── Queries ───────────────────────────────────────────────────────────────
  findAll() {
    return this.ordersRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'user'],
      order: { created_at: 'DESC' },
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

  async updateStatus(id: number, status: OrderStatus) {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) throw new NotFoundException('Order not found');

    order.status = status;
    return this.ordersRepository.save(order);
  }

  // ── Cancel Order (รองรับทั้งลูกค้าและ Admin) ──────────────────────────────
  async cancelOrder(id: number, reason: string, restock: boolean = true) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');

    const cancellable: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.PAID];
    if (!cancellable.includes(order.status)) {
      throw new BadRequestException('ไม่สามารถยกเลิกได้ในสถานะนี้');
    }

    // ── คืนสต็อกสินค้า (ถ้า restock = true) ──
    if (restock) {
      for (const item of order.items) {
        const product = await this.productsRepository.findOneBy({ id: item.product.id });
        if (product) {
          product.stock += item.quantity;
          await this.productsRepository.save(product);
        }
      }
    }

    order.status = OrderStatus.CANCELLED;
    order.cancel_reason = reason;
    return this.ordersRepository.save(order);
  }

  // ── Submit Rating + Review ────────────────────────────────────────────────
  async submitRating(
    orderId: number,
    ratings: Record<number, number>,
    reviews: Record<number, string>,
  ) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('สามารถรีวิวได้เฉพาะคำสั่งซื้อที่สำเร็จแล้วเท่านั้น');
    }

    for (const item of order.items) {
      if (ratings[item.id] !== undefined) {
        item.rating = ratings[item.id];
        item.review = reviews?.[item.id] ?? null;
        await this.orderItemsRepository.save(item);
      }
    }

    order.is_rated = true;
    await this.ordersRepository.save(order);
    return { success: true, message: 'บันทึกรีวิวสำเร็จ' };
  }
}