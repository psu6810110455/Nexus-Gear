import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  // ✨ ดักจับไฟล์ที่ส่งมาจากหน้าเว็บในชื่อ 'slipImage'
  @UseInterceptors(FileInterceptor('slipImage', {
    storage: diskStorage({
      destination: './uploads/slips', // 📁 โฟลเดอร์ที่จะเซฟรูปลงไป
      filename: (req, file, cb) => {
        // ✨ สุ่มชื่อไฟล์ใหม่ไม่ให้ซ้ำกัน ป้องกันรูปทับกัน
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'slip-' + uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  async checkout(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    // รับข้อมูล ที่อยู่ และ วิธีจ่ายเงิน ที่ส่งมาจากหน้าเว็บ
    const { userId = 1, shippingAddress, paymentMethod } = body;
    
    // ถ้ามีไฟล์แนบมา ให้เอาชื่อไฟล์ไปใช้งาน แต่ถ้าไม่มี(เช่น เลือกจ่ายแบบอื่น) ให้เป็น null
    const slipFilename = file ? file.filename : null;
    
    // ส่งข้อมูลไปให้ Service ทำงานต่อ (เพิ่มส่งชื่อไฟล์ไปด้วย)
    return this.ordersService.createOrder(userId, shippingAddress, paymentMethod, slipFilename);
  } 
}