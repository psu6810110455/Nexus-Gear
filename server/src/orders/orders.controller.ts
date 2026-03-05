import {
  Controller, Get, Post, Body, Patch, Param,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /api/orders/checkout — สั่งซื้อจากตะกร้า พร้อม slip upload
  @Post('checkout')
  @UseInterceptors(FileInterceptor('slipImage', {
    storage: diskStorage({
      destination: './uploads/slips',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'slip-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async checkout(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const { userId = 1, shippingAddress, paymentMethod } = body;
    const slipFilename = file ? file.filename : null;
    return this.ordersService.checkout(+userId, shippingAddress, paymentMethod, slipFilename);
  }

  // POST /api/orders — สร้าง Order แบบ manual
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  // GET /api/orders — ดึง Order ทั้งหมด (Admin)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // GET /api/orders/user/:userId — ดึง Order ของ User คนนั้น
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.ordersService.findByUserId(+userId);
  }

  // GET /api/orders/:id — ดึง Order เดี่ยว
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  // PATCH /api/orders/:id/status — อัปเดตสถานะ
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(+id, updateOrderStatusDto.status);
  }
}