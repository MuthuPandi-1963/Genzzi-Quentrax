import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { ResponseSender } from "../../common/responser/response.sender";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { BulkCreateCategoryDto } from "./dto/bulk-create-category.dto";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ── Public Routes ─────────────────────────────────────────────────────────

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const result = await this.categoriesService.findAll();
    return ResponseSender.success(
      result.categories,
      "Categories fetched successfully",
      200,
    );
  }

  @Public()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const category = await this.categoriesService.findOne(id);
    return ResponseSender.success(category, "Category fetched successfully");
  }

  // ── Protected Admin/Staff Routes ──────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.categoriesService.create(dto);
    return ResponseSender.success(
      category,
      "Category created successfully",
      201,
    );
  }

  @Post("many")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Body() dto: BulkCreateCategoryDto) {
    const result = await this.categoriesService.createMany(dto);
    if (!result) {
      throw new Error("Categories Creation Failed");
    }
    return ResponseSender.success(null, "Categories created successfully", 201);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async update(@Param("id") id: string, @Body() dto: UpdateCategoryDto) {
    const category = await this.categoriesService.update(id, dto);
    return ResponseSender.success(category, "Category updated successfully");
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("STAFF", "ADMIN")
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    await this.categoriesService.remove(id);
    return ResponseSender.success(null, "Category deleted successfully");
  }
}
