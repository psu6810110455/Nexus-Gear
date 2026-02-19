import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, ...productData } = createProductDto;

    const product = this.productsRepository.create(productData);

    if (categoryId) {
      const category = await this.categoriesRepository.findOne({ where: { id: Number(categoryId) } });
      if (!category) throw new NotFoundException(`Category #${categoryId} not found`);
      product.category = category;
    }

    return this.productsRepository.save(product);
  }

  async findAll() {
    return this.productsRepository.find({ relations: ['category'] });
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { categoryId, ...productData } = updateProductDto;

    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);

    Object.assign(product, productData);

    if (categoryId) {
      const category = await this.categoriesRepository.findOne({ where: { id: Number(categoryId) } });
      if (!category) throw new NotFoundException(`Category #${categoryId} not found`);
      product.category = category;
    } else if (categoryId === null) {
      product.category = null as any;
    }

    return this.productsRepository.save(product);
  }

  remove(id: number) {
    return this.productsRepository.delete(id);
  }
}