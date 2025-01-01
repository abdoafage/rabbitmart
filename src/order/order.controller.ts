import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order-dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() data: CreateOrderDTO[]) {
    const customerId = Math.floor(Math.random() * 1000); // Random customer ID for demo purposes, and in real purposes, this should be fetched from the request LIKE JWT token.
    return this.orderService.createOrder(customerId, data);
  }

  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }
}
