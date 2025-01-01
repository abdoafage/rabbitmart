import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order-dto';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  async createOrder(customerId: number, orderData: CreateOrderDTO[]) {
    return this.orderRepository.createOrder(customerId, orderData);
  }

  async getAllOrders() {
    return this.orderRepository.getAllOrders();
  }
}
