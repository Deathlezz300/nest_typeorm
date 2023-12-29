import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/productImage.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[TypeOrmModule.forFeature([
    Product,
    ProductImage,
  ])
  ,ConfigModule
  ,AuthModule
],
  exports:[ProductsService,TypeOrmModule]
})
export class ProductsModule {}
