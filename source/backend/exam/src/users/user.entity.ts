import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User {
  @ApiProperty({ description: '用户ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '用户邮箱', example: 'user@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: '用户名字', example: '张' })
  @Column()
  firstName: string;

  @ApiProperty({ description: '用户姓氏', example: '三' })
  @Column()
  lastName: string;

  @ApiProperty({
    description: '用户密码（加密后）',
    example: 'encrypted_password',
  })
  @Column()
  password: string;

  @ApiProperty({ description: '用户是否激活', example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdDate: Date;

  @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00.000Z' })
  @UpdateDateColumn()
  updatedDate: Date;

  @ApiProperty({ description: '是否为管理员', example: false })
  @Column({ default: false })
  isAdmin: boolean;
}
