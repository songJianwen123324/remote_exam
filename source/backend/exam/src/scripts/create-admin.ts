import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

async function createAdminUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);

  const adminDto: CreateUserDto = {
    email: 'admin@example.com',
    firstName: '管理员',
    lastName: '用户',
    password: 'admin123456',
    isAdmin: true,
  };

  try {
    const admin = await userService.create(adminDto);
    console.log('✅ 管理员创建成功:');
    console.log(`   邮箱: ${admin.email}`);
    console.log(`   姓名: ${admin.firstName} ${admin.lastName}`);
    console.log(`   ID: ${admin.id}`);
    console.log(`   管理员权限: ${admin.isAdmin ? '是' : '否'}`);
    console.log('\n🔑 登录信息:');
    console.log(`   邮箱: admin@example.com`);
    console.log(`   密码: admin123456`);
  } catch (error) {
    if (error.message.includes('用户邮箱已存在')) {
      console.log('⚠️  管理员用户已存在，无需重复创建');
    } else {
      console.error('❌ 创建管理员失败:', error.message);
    }
  }

  await app.close();
}

createAdminUser();
