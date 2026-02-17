import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 5433,
      username: 'root',
      password: 'rootpassword',
      database: 'ecommerce_db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    ProductsModule,
  ],
})
export class AppModule {}
