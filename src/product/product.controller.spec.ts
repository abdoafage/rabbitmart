import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductRepository } from './product.repository';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [PrismaService, ProductService, ProductRepository],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('create', () => {
  //   it('should create a new product', async () => {
  //     const createProductDto: CreateProductDto = {
  //       name: 'Test Product',
  //       category: 'Electronics',
  //       area: 'North',
  //     };

  //     expect(await controller.createProduct(createProductDto)).toEqual(mockProduct);
  //   });
  // });

  describe('findAll', () => {
    it('should return a page 1 of products', async () => {
      const allProducts = await controller.getAllProducts({});
      expect(allProducts.length).toEqual(50);
      expect(allProducts[0].id).toEqual(1);
      expect(allProducts[allProducts.length - 1].id).toEqual(50);
    });

    it('should return a page 2 of products', async () => {
      const allProducts = await controller.getAllProducts({ page: 2 });
      expect(allProducts.length).toEqual(50);
      expect(allProducts[0].id).toEqual(51);
      expect(allProducts[allProducts.length - 1].id).toEqual(100);
    });

    it('should return a categories list of products', async () => {
      const allProducts = await controller.getAllProducts({
        categories: ['Product 2 Category', 'Product 3 Category'],
      });

      expect(allProducts.length).toEqual(2);
      expect(allProducts[0].id).toEqual(2);
      expect(allProducts[1].id).toEqual(3);
    });
  });

  describe('Get top products', () => {
    it('should return top product in certain area.', async () => {
      const products = await controller.getTopProducts({
        area: 'Maadi',
        count: 10,
      });
      expect(products.length).toEqual(10);
    });
  });
});
