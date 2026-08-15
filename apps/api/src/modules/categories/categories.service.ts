import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type { CreateCategoryInput, UpdateCategoryInput } from "@riseskill/shared";
import { CategoriesRepository } from "./categories.repository";

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  findAll() {
    return this.categoriesRepository.findMany();
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return category;
  }

  async create(data: CreateCategoryInput) {
    const existing = await this.categoriesRepository.findBySlug(data.slug);
    if (existing) {
      throw new ConflictException(`A category with slug "${data.slug}" already exists`);
    }
    return this.categoriesRepository.create(data);
  }

  async update(id: string, data: UpdateCategoryInput) {
    await this.findOne(id);
    return this.categoriesRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.categoriesRepository.delete(id);
  }
}
