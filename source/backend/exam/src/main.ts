import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { knife4jSetup } from 'nestjs-knife4j';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动去除不在DTO中的属性
      forbidNonWhitelisted: true, // 如果请求包含非白名单属性则抛出错误
      transform: true, // 自动将有效负载转换为DTO实例
    }),
  );

  // 配置 Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('远程考试系统 API')
    .setDescription('远程考试系统的接口文档，基于 NestJS 和 Knife4j 风格')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '请输入 JWT token',
      },
      'JWT-auth',
    )
    .addTag('用户管理', '用户相关的接口')
    .addTag('认证授权', '登录、注册、权限相关的接口')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 设置标准的 Swagger 文档
  SwaggerModule.setup('api', app, document);

  // 使用真正的 Knife4j 界面
  knife4jSetup(app, {
    urls: [
      {
        name: '远程考试系统 API v1.0',
        url: '/api-json',
        swaggerVersion: '3.0',
        location: '/api-json',
      },
    ],
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`应用正在端口 ${process.env.PORT ?? 3000} 上运行`);
  console.log(
    `API 文档地址: http://localhost:${process.env.PORT ?? 3000}/doc.html`,
  );
}
bootstrap();
