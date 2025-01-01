import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDTO } from './dto/create-order-dto';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async createOrder(customerId: number, data: CreateOrderDTO[]) {
    //  (customerId, data);
    return await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: { customerId },
      });

      // Map the order items to include the orderId
      const orderItems = data.map((item) => ({ ...item, orderId: order.id }));

      await tx.orderItem.createMany({
        data: orderItems,
      });
      return order;
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: { items: true },
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  }
}
