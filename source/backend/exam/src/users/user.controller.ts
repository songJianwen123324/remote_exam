import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('用户管理')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建用户', description: '创建新用户账户' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: '用户创建成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        isActive: { type: 'boolean' },
        isAdmin: { type: 'boolean' },
        createdDate: { type: 'string', format: 'date-time' },
        updatedDate: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 409, description: '用户邮箱已存在' })
  @ApiResponse({ status: 400, description: '请求参数验证失败' })
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '获取用户列表',
    description: '分页获取用户列表（管理员权限）',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '页码，默认为1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '每页数量，默认为10，最大100',
  })
  @ApiResponse({
    status: 200,
    description: '获取用户列表成功',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              email: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              isActive: { type: 'boolean' },
              isAdmin: { type: 'boolean' },
              createdDate: { type: 'string', format: 'date-time' },
              updatedDate: { type: 'string', format: 'date-time' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            currentPage: { type: 'number' },
            totalPages: { type: 'number' },
            totalItems: { type: 'number' },
            itemsPerPage: { type: 'number' },
            hasNextPage: { type: 'boolean' },
            hasPreviousPage: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '权限不足，需要管理员权限' })
  findAll(@Query(ValidationPipe) paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '获取用户详情',
    description: '根据ID获取用户详细信息',
  })
  @ApiParam({ name: 'id', type: 'number', description: '用户ID' })
  @ApiResponse({
    status: 200,
    description: '获取用户详情成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        isActive: { type: 'boolean' },
        isAdmin: { type: 'boolean' },
        createdDate: { type: 'string', format: 'date-time' },
        updatedDate: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '更新用户信息', description: '更新指定用户的信息' })
  @ApiParam({ name: 'id', type: 'number', description: '用户ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: '用户信息更新成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        isActive: { type: 'boolean' },
        isAdmin: { type: 'boolean' },
        createdDate: { type: 'string', format: 'date-time' },
        updatedDate: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 409, description: '邮箱已被其他用户使用' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '删除用户',
    description: '删除指定用户（管理员权限）',
  })
  @ApiParam({ name: 'id', type: 'number', description: '用户ID' })
  @ApiResponse({ status: 204, description: '用户删除成功' })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '权限不足，需要管理员权限' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
