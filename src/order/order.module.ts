import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './orderItem.entity';
import { Product } from '../catalog/product.entity';
import { CreateOrderController } from './createOrder/createOrder.controller';
import { CreateOrderService } from './createOrder/createOrder.service';
import { AddProductToOrderController } from './addProductToOrder/addProductToOrder.controller';
import { AddProductToOrderService } from './addProductToOrder/addProductToOrder.service';
import { RemoveProductFromOrderController } from './removeProductFromOrder/removeProductFromOrder.controller';
import { RemoveProductFromOrderService } from './removeProductFromOrder/removeProductFromOrder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product])],
  controllers: [CreateOrderController, AddProductToOrderController, RemoveProductFromOrderController],
  providers: [CreateOrderService, AddProductToOrderService, RemoveProductFromOrderService],
})
export class OrderModule {}
