import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { PAGINATION_PAGE_SIZE } from '../constants/constants';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetTopProductDTO } from './dto/get-top-product.dto';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: GetAllProductsDTO, page: number): Promise<Product[]> {
    const conditions = [];

    // console.log(filters);

    if (filters?.categories && filters.categories.length > 0) {
      conditions.push({ category: { in: filters.categories } });
    }

    if (filters?.areas && filters.areas.length > 0) {
      conditions.push({ area: { in: filters.areas } });
    }
    return this.prisma.product.findMany({
      where: {
        AND: [...conditions],
      },
      take: +PAGINATION_PAGE_SIZE,
      skip: Number((page - 1) * +PAGINATION_PAGE_SIZE),
    });
  }

  async findById(id: number): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  async create(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Product> {
    return await this.prisma.product.delete({
      where: { id },
    });
  }

  // I used a raw query to get the top products instead of using Prisma's query builder.
  // This is because Prisma's query builder consume a lot of time to get the top products.
  // The raw query is more efficient in this case.
  //  You can cache it in any cache system like (i.e. redis, memcache) to make it faster and set TTL with 1 day for example.
  async getTopProducts(
    topProductProps: GetTopProductDTO,
  ): Promise<(Product & { total_quantity: number })[]> {
    const { area, count } = topProductProps;

    const products = (await this.prisma.$queryRaw`

  SELECT 
    "Product"."id", "Product"."name", "Product"."category", "Product"."area", "Product"."createdAt", SUM("OrderItem"."quantity") AS total_quantity
  FROM 
    "Product"
  INNER JOIN 
    "OrderItem" ON "Product"."id" = "OrderItem"."productId"
  WHERE 
    "Product"."area" = ${area} 
  GROUP BY 
    "Product"."id", "Product"."name", "Product"."category", "Product"."area", "Product"."createdAt"
  ORDER BY 
    total_quantity DESC
  LIMIT ${count};
`) as (Product & { total_quantity: number })[];

    return products;
  }
}
