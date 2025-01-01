import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { ProductDTO } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';
import { GetTopProductDTO } from './dto/get-top-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductRepository,
    private prismaService: PrismaService,
  ) {}

  async getAllProducts(filters: GetAllProductsDTO): Promise<ProductDTO[]> {
    const { page = 1 } = filters;
    return await this.productsRepository.findAll(filters, page);
  }

  async getProductById(id: number): Promise<ProductDTO> {
    const prod = await this.productsRepository.findById(id);
    if (!prod) throw new NotFoundException(`Product with ID ${id} not found`);
    return prod;
  }
  async createProduct(product: CreateProductDto): Promise<ProductDTO> {
    return await this.productsRepository.create(product);
  }

  async updateProduct(
    id: number,
    updateProductRequest: UpdateProductDto,
  ): Promise<ProductDTO> {
    return await this.productsRepository.update(id, updateProductRequest);
  }

  async deleteProduct(id: number): Promise<Product> {
    return await this.productsRepository.delete(id);
  }

  async getTopProducts(
    topProductProps: GetTopProductDTO,
  ): Promise<(Product & { total_quantity: number })[]> {
    const products =
      await this.productsRepository.getTopProducts(topProductProps);
    const new_products = products.map((product) => {
      return { ...product, total_quantity: Number(product.total_quantity) };
    });
    return new_products;
  }
}
