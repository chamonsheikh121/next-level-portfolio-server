import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailQueueService } from '../../common/email/email-queue.service';
import { CreateUserMessageDto } from './dto/create-user-message.dto';
import { UpdateUserMessageDto } from './dto/update-user-message.dto';
import { MessageStatus } from './dto/update-status.dto';

@Injectable()
export class UserMessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailQueueService: EmailQueueService,
  ) {}

  async create(createUserMessageDto: CreateUserMessageDto) {
    try {
      const userMessage = await this.prisma.client.user_message.create({
        data: createUserMessageDto,
      });

      // Queue confirmation email to user
      await this.emailQueueService.sendUserMessageConfirmation(
        createUserMessageDto.email,
        createUserMessageDto.name,
        createUserMessageDto.title,
      );

      // Queue notification email to admin
      await this.emailQueueService.sendAdminNewMessageNotification(
        createUserMessageDto.name,
        createUserMessageDto.email,
        createUserMessageDto.title,
        createUserMessageDto.message,
      );

      return {
        statusCode: 201,
        message: 'Message created successfully',
        data: userMessage,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to create message',
        error: error.message,
      });
    }
  }

  async findAll() {
    try {
      const messages = await this.prisma.client.user_message.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        statusCode: 200,
        message: 'Messages retrieved successfully',
        data: messages,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to retrieve messages',
        error: error.message,
      });
    }
  }

  async findOne(id: number) {
    try {
      const message = await this.prisma.client.user_message.findUnique({
        where: { id },
      });

      if (!message) {
        throw new NotFoundException({
          statusCode: 404,
          message: `Message with ID ${id} not found`,
        });
      }

      return {
        statusCode: 200,
        message: 'Message retrieved successfully',
        data: message,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to retrieve message',
        error: error.message,
      });
    }
  }

  async update(id: number, updateUserMessageDto: UpdateUserMessageDto) {
    try {
      const existingMessage = await this.prisma.client.user_message.findUnique({
        where: { id },
      });

      if (!existingMessage) {
        throw new NotFoundException({
          statusCode: 404,
          message: `Message with ID ${id} not found`,
        });
      }

      const updatedMessage = await this.prisma.client.user_message.update({
        where: { id },
        data: updateUserMessageDto,
      });

      return {
        statusCode: 200,
        message: 'Message updated successfully',
        data: updatedMessage,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to update message',
        error: error.message,
      });
    }
  }

  async updateStatus(id: number, status: MessageStatus) {
    try {
      const existingMessage = await this.prisma.client.user_message.findUnique({
        where: { id },
      });

      if (!existingMessage) {
        throw new NotFoundException({
          statusCode: 404,
          message: `Message with ID ${id} not found`,
        });
      }

      const updatedMessage = await this.prisma.client.user_message.update({
        where: { id },
        data: { status },
      });

      return {
        statusCode: 200,
        message: 'Message status updated successfully',
        data: updatedMessage,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to update message status',
        error: error.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const existingMessage = await this.prisma.client.user_message.findUnique({
        where: { id },
      });

      if (!existingMessage) {
        throw new NotFoundException({
          statusCode: 404,
          message: `Message with ID ${id} not found`,
        });
      }

      await this.prisma.client.user_message.delete({
        where: { id },
      });

      return {
        statusCode: 200,
        message: 'Message deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to delete message',
        error: error.message,
      });
    }
  }
}
