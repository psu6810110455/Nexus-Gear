import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../products/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll() {
    return this.categoriesRepository.find();
  }

  async create(data: { name: string; imageUrl?: string }) {
    const category = this.categoriesRepository.create({
      name: data.name,
      imageUrl: data.imageUrl ?? undefined,
    });
    return this.categoriesRepository.save(category);
  }

  async update(id: number, data: { name?: string; imageUrl?: string }) {
    await this.categoriesRepository.update(id, {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
    });
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.categoriesRepository.delete(id);
  }
}