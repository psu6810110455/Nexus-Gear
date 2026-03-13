import { Controller, Get, Post, Body, Patch, Param, Delete, Query,
  UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// กรองชนิดไฟล์ — รับเฉพาะ JPG, PNG, WebP เท่านั้น
const imageFileFilter = (_req: any, file: Express.Multer.File, cb: Function) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException(`ไม่รองรับไฟล์ชนิด ${file.mimetype} — รับเฉพาะ JPG, PNG, WebP`), false);
  }
};

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('includeHidden') includeHidden?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.productsService.findAll(
      search, category, includeHidden === 'true',
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  // ── ดูรีวิวของสินค้า ──
  @Get(':id/reviews')
  getReviews(@Param('id') id: string) {
    return this.productsService.getReviews(+id);
  }

  // ── อัปโหลดรูปสินค้า (สูงสุด 4 รูป) ──
  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 4, {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `product-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  }))
  uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.uploadImages(+id, files);
  }

  // ── ลบรูปสินค้า ──
  @Delete(':id/images/:imageId')
  deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productsService.deleteImage(+id, +imageId);
  }
}