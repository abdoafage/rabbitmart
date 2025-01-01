import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetTopProductDTO } from './dto/get-top-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async getAllProducts(
    @Query(new ValidationPipe({ transform: true })) filters: GetAllProductsDTO,
  ) {
    // console.log(filters);
    const products = await this.productsService.getAllProducts(filters);
    return products;
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return this.productsService.getProductById(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body(ValidationPipe) product: CreateProductDto) {
    return await this.productsService.createProduct(product);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductRequest: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(Number(id), updateProductRequest);
  }

  @Post('top-products')
  @HttpCode(HttpStatus.OK)
  async getTopProducts(
    @Body(ValidationPipe) topProductProps: GetTopProductDTO,
  ) {
    return await this.productsService.getTopProducts(topProductProps);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(Number(id));
  }
}
