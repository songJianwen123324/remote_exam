import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';

@ApiTags('认证授权')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录', description: '普通用户登录接口' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', description: 'JWT访问令牌' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            isActive: { type: 'boolean' },
            isAdmin: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '管理员登录', description: '管理员专用登录接口' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: '管理员登录成功',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', description: 'JWT访问令牌' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            isActive: { type: 'boolean' },
            isAdmin: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '管理员账户不存在或密码错误' })
  @ApiResponse({ status: 403, description: '非管理员账户' })
  async adminLogin(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '获取用户信息',
    description: '获取当前登录用户的个人信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取用户信息成功',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            isActive: { type: 'boolean' },
            isAdmin: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权访问' })
  getProfile(@Request() req) {
    return {
      user: req.user,
    };
  }

  @Get('admin/profile')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '获取管理员信息',
    description: '获取当前登录管理员的个人信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取管理员信息成功',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            isActive: { type: 'boolean' },
            isAdmin: { type: 'boolean' },
          },
        },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '权限不足，需要管理员权限' })
  getAdminProfile(@Request() req) {
    return {
      user: req.user,
      message: '管理员信息',
    };
  }
}
