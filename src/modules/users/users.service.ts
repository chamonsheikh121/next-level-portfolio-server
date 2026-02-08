import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailQueueService } from '../../common/email/email-queue.service';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private emailQueueService: EmailQueueService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prismaService.client.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prismaService.client.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    // Queue welcome email
    await this.emailQueueService.sendWelcomeEmail(user.email, user.name);

    // Remove password from response
    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prismaService.client.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.prismaService.client.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prismaService.client.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.client.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updateData: any = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prismaService.client.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.prismaService.client.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prismaService.client.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}
