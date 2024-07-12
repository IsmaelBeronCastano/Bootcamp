import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { ClientModule } from './client/client.module';
import { Client } from './client/entities/client.entity';
import { Address } from './client/entities/address.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'shop',
      entities: [Product, Client, Address, Order],
      synchronize: true,
    }),
    ProductModule,
    ClientModule,
    OrderModule,
  ],
})
export class AppModule {}