import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { Category } from './entities/category.entity';  
import { OrderItem } from '../orders/entities/order-item.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, Category, OrderItem]),
    MulterModule.register({ dest: './uploads/products' }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
