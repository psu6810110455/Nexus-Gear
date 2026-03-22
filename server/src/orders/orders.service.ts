import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem }          from './entities/order-item.entity';
import { CreateOrderDto }     from './dto/create-order.dto';
import { Product }            from '../products/entities/product.entity';
import { User }               from '../users/entities/user.entity';
import { Cart }               from '../cart/entities/cart.entity';
import { ChatGateway }        from '../chat/chat.gateway';
import { OrdersGateway }      from './orders.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)      private ordersRepository:     Repository<Order>,
    @InjectRepository(OrderItem)  private orderItemsRepository:  Repository<OrderItem>,
    @InjectRepository(Product)    private productsRepository:    Repository<Product>,
    @InjectRepository(User)       private usersRepository:       Repository<User>,
    @InjectRepository(Cart)       private cartRepository:        Repository<Cart>,
    private chatGateway:   ChatGateway,
    private ordersGateway: OrdersGateway,
  ) {}

  // ── Checkout จากตะกร้า ────────────────────────────────────────────────────
  async checkout(
    userId:                  number,
    shippingAddress:         string,
    paymentMethod:           string,
    slipImage:               string | null,
    stripePaymentIntentId?:  string | null,
    couponCode?:             string | null,  //  โค้ดคูปอง
    discountAmount?:         number,         //  จำนวนส่วนลด
  ) {
    // 1. ดึงสินค้าในตะกร้า
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
    if (!cartItems.length) {
      throw new BadRequestException('ตะกร้าสินค้าว่างเปล่า ไม่สามารถสั่งซื้อได้');
    }

    // 2. หา User
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    // 3. คำนวณราคาและสร้าง Order Items
    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    for (const cartItem of cartItems) {
      const product = await this.productsRepository.findOneBy({ id: cartItem.product.id });
      if (!product) throw new NotFoundException(`ไม่พบสินค้า ID: ${cartItem.product.id}`);

      const orderItem             = new OrderItem();
      orderItem.product           = product;
      orderItem.quantity          = cartItem.quantity;
      orderItem.price_at_purchase = product.price;

      subtotal += Number(product.price) * cartItem.quantity;
      orderItems.push(orderItem);

      // ตัดสต็อก
      product.stock -= cartItem.quantity;
      await this.productsRepository.save(product);
    }

    // 4. คำนวณราคาสุทธิหลังหักคูปอง
    const discount   = Number(discountAmount) || 0;
    const finalPrice = Math.max(0, subtotal - discount);

    // 5. สร้าง Order
    const order                    = new Order();
    order.user                     = user;
    order.shipping_address         = shippingAddress;
    order.payment_method           = paymentMethod;
    order.order_number             = 'ORD-' + Date.now();
    order.items                    = orderItems;
    order.total_price              = finalPrice;         //  ราคาหลังหักส่วนลด
    order.discount_amount          = discount;           //  บันทึกส่วนลด
    order.coupon_code              = couponCode || null; //  บันทึกโค้ดคูปอง
    order.slip_image               = slipImage;
    order.status                   = OrderStatus.PENDING;

    // QR จ่ายผ่าน Stripe → เปลี่ยน status เป็น PAID ทันที
    if (stripePaymentIntentId) {
      order.stripe_payment_intent_id = stripePaymentIntentId;
      order.status                   = OrderStatus.PAID;
    }

    const savedOrder = await this.ordersRepository.save(order);

    // 6. ล้างตะกร้า
    await this.cartRepository.delete({ user: { id: userId } });

    return {
      success:     true,
      message:     'สั่งซื้อและตัดสต็อกสินค้าสำเร็จ!',
      orderId:     savedOrder.id,
      orderNumber: savedOrder.order_number,
      totalAmount: finalPrice,
      discount,
      couponCode:  couponCode || null,
    };
  }

  // ── Create Order แบบ manual (Admin) ──────────────────────────────────────
  async create(createOrderDto: CreateOrderDto) {
    const { userId, shippingAddress, items } = createOrderDto;

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const order            = new Order();
    order.user             = user;
    order.shipping_address = shippingAddress;
    order.status           = OrderStatus.PENDING;
    order.items            = [];

    let totalPrice = 0;
    for (const itemDto of items) {
      const product = await this.productsRepository.findOneBy({ id: itemDto.productId });
      if (!product) throw new NotFoundException(`ไม่พบสินค้า ID: ${itemDto.productId}`);

      const orderItem             = new OrderItem();
      orderItem.product           = product;
      orderItem.quantity          = itemDto.quantity;
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

  findByUserId(userId: number): Promise<Order[]> {
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
    if (!order) throw new NotFoundException(`ไม่พบคำสั่งซื้อหมายเลข ${id}`);
    return order;
  }

  // ── Update Status ─────────────────────────────────────────────────────────
  async updateStatus(id: number, status: OrderStatus) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!order) throw new NotFoundException('Order not found');

    order.status = status;
    if (status === OrderStatus.COMPLETED) order.completed_at = new Date();

    const savedOrder = await this.ordersRepository.save(order);
    this.ordersGateway.emitOrderUpdate(savedOrder);

    const statusMessages: Partial<Record<OrderStatus, string>> = {
      [OrderStatus.PAID]:      'ชำระเงินสำเร็จแล้ว',
      [OrderStatus.TO_SHIP]:   'กำลังเตรียมจัดส่ง',
      [OrderStatus.SHIPPED]:   'กำลังนำส่งสินค้า',
      [OrderStatus.COMPLETED]: 'สินค้าถึงมือท่านแล้ว! อย่าลืมมารีวิวสินค้าให้เราด้วยนะครับ',
      [OrderStatus.CANCELLED]: 'ออเดอร์ของท่านถูกยกเลิกแล้ว',
    };

    const statusText = statusMessages[status];
    if (statusText) {
      this.chatGateway.sendSystemMessage(
        order.user.id,
        `� แจ้งเตือนออเดอร์ ${order.order_number}: ${statusText}`,
      );
    }

    return savedOrder;
  }

  // ── Cancel Order ──────────────────────────────────────────────────────────
  async cancelOrder(
    id: number,
    reason: string,
    restock = true,
    bankName?: string,
    bankAccount?: string,
  ) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });
    if (!order) throw new NotFoundException('Order not found');

    const cancellable = [OrderStatus.PENDING, OrderStatus.PAID];
    if (!cancellable.includes(order.status)) {
      throw new BadRequestException('ไม่สามารถยกเลิกได้ในสถานะนี้');
    }

    if (restock) {
      for (const item of order.items) {
        const product = await this.productsRepository.findOneBy({ id: item.product.id });
        if (product) {
          product.stock += item.quantity;
          await this.productsRepository.save(product);
        }
      }
    }

    order.status        = OrderStatus.CANCELLED;
    order.cancel_reason = reason;
    if (bankName)    order.refund_bank_name    = bankName;
    if (bankAccount) order.refund_bank_account = bankAccount;
    if (bankName && bankAccount) order.refund_status = 'pending';

    const saved = await this.ordersRepository.save(order);
    this.ordersGateway.emitOrderCancelled(saved);

    // Send chat notification to user
    if (order.user) {
      this.chatGateway.sendSystemMessage(order.user.id, `� ออเดอร์ ${order.order_number} ถูกยกเลิกแล้ว: ${reason}`);
    }

    return saved;
  }

  // ── Process Refund (Admin) ────────────────────────────────────────────────
  async processRefund(
    id: number,
    refundAmount: number,
    refundChannel: string,
    refundSlip: string | null,
  ) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.CANCELLED) {
      throw new BadRequestException('สามารถคืนเงินได้เฉพาะคำสั่งซื้อที่ยกเลิกแล้วเท่านั้น');
    }

    order.refund_amount  = refundAmount;
    order.refund_channel = refundChannel;
    order.refund_slip    = refundSlip;
    order.refund_status  = 'refunded';
    order.refunded_at    = new Date();

    const saved = await this.ordersRepository.save(order);
    this.ordersGateway.emitRefundProcessed(saved);

    // Send chat notification to user
    if (order.user) {
      this.chatGateway.sendSystemMessage(order.user.id, `� คืนเงินสำเร็จสำหรับออเดอร์ ${order.order_number} จำนวน ฿${refundAmount.toLocaleString()}`);
    }

    return saved;
  }

  // ── Request Return (ลูกค้า — ภายใน 3 วันหลัง completed) ─────────────────
  async requestReturn(
    id: number,
    reason: string,
    bankName?: string,
    bankAccount?: string,
  ) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('สามารถขอคืนสินค้าได้เฉพาะคำสั่งซื้อที่สำเร็จแล้วเท่านั้น');
    }

    const completedAt = new Date(order.completed_at ?? order.created_at);
    const daysSince   = (Date.now() - completedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 3) {
      throw new BadRequestException('เกินระยะเวลา 3 วันที่สามารถขอคืนสินค้าได้');
    }

    for (const item of order.items) {
      const product = await this.productsRepository.findOneBy({ id: item.product.id });
      if (product) {
        product.stock += item.quantity;
        await this.productsRepository.save(product);
      }
    }

    order.status        = OrderStatus.CANCELLED;
    order.cancel_reason = `ขอคืนสินค้า: ${reason}`;
    order.refund_status = 'pending';
    if (bankName)    order.refund_bank_name    = bankName;
    if (bankAccount) order.refund_bank_account = bankAccount;

    const saved = await this.ordersRepository.save(order);
    this.ordersGateway.emitOrderCancelled(saved);
    return saved;
  }

  // ── Submit Refund Info (ลูกค้า) ───────────────────────────────────────────
  async submitRefundInfo(id: number, bankName: string, bankAccount: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.CANCELLED) {
      throw new BadRequestException('สามารถส่งข้อมูลคืนเงินได้เฉพาะคำสั่งซื้อที่ยกเลิกแล้วเท่านั้น');
    }

    order.refund_bank_name    = bankName;
    order.refund_bank_account = bankAccount;
    order.refund_status       = 'pending';

    const saved = await this.ordersRepository.save(order);
    this.ordersGateway.emitOrderUpdate(saved);
    return saved;
  }

  // ── Reject Refund (Admin) ─────────────────────────────────────────────────
  async rejectRefund(id: number, reason?: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.CANCELLED) {
      throw new BadRequestException('สามารถปฏิเสธการคืนเงินได้เฉพาะคำสั่งซื้อที่ยกเลิกแล้วเท่านั้น');
    }

    order.refund_status = 'rejected';
    if (reason) order.cancel_reason = reason;

    const saved = await this.ordersRepository.save(order);
    this.ordersGateway.emitRefundProcessed(saved);
    return saved;
  }

  // ── Submit Rating + Review ────────────────────────────────────────────────
  async submitRating(
    orderId: number,
    ratings: Record<number, number>,
    reviews: Record<number, string>,
  ) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
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

    const ratedProductIds = [...new Set(
      order.items
        .filter(item => ratings[item.id] !== undefined)
        .map(item => item.product.id),
    )];

    for (const productId of ratedProductIds) {
      const result = await this.orderItemsRepository
        .createQueryBuilder('oi')
        .select('AVG(oi.rating)', 'avg')
        .innerJoin('oi.product', 'p')
        .where('p.id = :productId AND oi.rating IS NOT NULL', { productId })
        .getRawOne();

      if (result?.avg != null) {
        await this.productsRepository.update(productId, {
          rating_average: parseFloat(parseFloat(result.avg).toFixed(1)),
        });
      }
    }

    return { success: true, message: 'บันทึกรีวิวสำเร็จ' };
  }
}