import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { Category } from './entities/category.entity';
import { OrderItem } from '../orders/entities/order-item.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImagesRepository: Repository<ProductImage>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
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

  findAll(search?: string, category?: string, includeHidden: boolean = false, minPrice?: number, maxPrice?: number) {
    const query = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images');

    if (!includeHidden) {
      query.andWhere('product.isHidden = :isHidden', { isHidden: false });
    }

    if (search) {
      query.andWhere('product.name LIKE :search', { search: `%${search}%` });
    }

    if (category && category !== 'All') {
      query.andWhere('LOWER(category.name) = LOWER(:category)', { category });
    }

    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    query.addOrderBy('product.id', 'ASC');
    query.addOrderBy('images.sortOrder', 'ASC');

    return query.getMany();
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'images'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    // เรียงลำดับรูปภาพ
    if (product.images) {
      product.images.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);

    const { categoryId, ...rest } = updateProductDto;
    Object.assign(product, rest);

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

  // ── ดึงรีวิวของสินค้า ──
  async getReviews(productId: number) {
    const items = await this.orderItemsRepository.find({
      where: { product: { id: productId } },
      relations: ['order', 'order.user'],
    });

    return items
      .filter((item) => item.rating !== null)
      .map((item) => ({
        id:     item.id,
        rating: item.rating,
        review: item.review ?? null,
        user:   { name: item.order?.user?.name ?? 'ลูกค้า' },
      }));
  }

  // ── อัปโหลดรูปสินค้า (สูงสุด 4 รูป) ──
  async uploadImages(productId: number, files: Express.Multer.File[]) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['images'],
    });
    if (!product) throw new NotFoundException(`Product #${productId} not found`);

    const currentCount = product.images?.length || 0;
    if (currentCount + files.length > 4) {
      throw new BadRequestException(
        `สินค้านี้มีรูปอยู่แล้ว ${currentCount} รูป สามารถเพิ่มได้อีก ${4 - currentCount} รูปเท่านั้น (สูงสุด 4 รูป)`,
      );
    }

    const images: ProductImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const img = this.productImagesRepository.create({
        imageUrl: `/uploads/products/${files[i].filename}`,
        sortOrder: currentCount + i,
        productId,
      });
      images.push(await this.productImagesRepository.save(img));
    }

    // อัปเดต image_url หลักของ product ด้วยรูปแรก (ถ้ายังไม่มี)
    if (!product.imageUrl && images.length > 0) {
      await this.productsRepository.update(productId, { imageUrl: images[0].imageUrl });
    }

    return { message: `อัปโหลดสำเร็จ ${files.length} รูป`, images };
  }

  // ── ลบรูปสินค้า ──
  async deleteImage(productId: number, imageId: number) {
    const image = await this.productImagesRepository.findOne({
      where: { id: imageId, productId },
    });
    if (!image) throw new NotFoundException(`Image #${imageId} not found`);

    // ลบไฟล์จริงจาก disk
    const filePath = path.join(process.cwd(), image.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.productImagesRepository.remove(image);
    return { message: 'ลบรูปสำเร็จ' };
  }
}