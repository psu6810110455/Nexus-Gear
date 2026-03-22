// src/cart/cart.controller.ts
import { Controller, Post, Body, Get, Delete, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard) //  ทุก endpoint ต้อง login
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() body: { productId: number; quantity: number }, @Request() req: any) {
    return this.cartService.addToCart(req.user.userId, body.productId, body.quantity);
  }

  @Get()
  async getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  @Delete(':itemId')
  async removeFromCart(@Param('itemId') itemId: string, @Request() req: any) {
    return this.cartService.removeFromCart(req.user.userId, Number(itemId));
  }

  @Patch(':itemId')
  async updateQuantity(
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
    @Request() req: any,
  ) {
    return this.cartService.updateQuantity(req.user.userId, Number(itemId), quantity);
  }
}