import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';  
import { OrderItem } from '../orders/entities/order-item.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, OrderItem])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
