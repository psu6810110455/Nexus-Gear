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
      const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
      if (!category) throw new NotFoundException(`Category #${categoryId} not found`);
      product.category = category;
    }

    return this.productsRepository.save(product);
  }

  findAll(search?: string, category?: string, includeHidden: boolean = false) {
    const query = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (!includeHidden) {
      query.andWhere('product.isHidden = :isHidden', { isHidden: false });
    }

    if (search) {
      query.andWhere('product.name LIKE :search', { search: `%${search}%` });
    }

    if (category) {
      query.andWhere('category.name = :category', { category });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  // ✅ แก้: update ให้รองรับ categoryId เหมือน create
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);

    const { categoryId, ...rest } = updateProductDto;

    // อัปเดตฟิลด์ปกติ
    Object.assign(product, rest);

    // อัปเดต category ถ้ามี categoryId ส่งมา
    if (categoryId !== undefined) {
      if (categoryId === null) {
        product.category = null;
      } else {
        const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
        if (!category) throw new NotFoundException(`Category #${categoryId} not found`);
        product.category = category;
      }
    }

    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return this.productsRepository.remove(product);
  }
}