import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UserMessageService } from './user-message.service';
import { CreateUserMessageDto } from './dto/create-user-message.dto';
import { UpdateUserMessageDto } from './dto/update-user-message.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('user-messages')
@Controller('user-messages')
export class UserMessageController {
  constructor(private readonly userMessageService: UserMessageService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new user message' })
  @ApiResponse({
    status: 201,
    description: 'Message created successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Message created successfully',
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          title: 'Inquiry about collaboration',
          message: 'I would love to discuss potential collaboration opportunities...',
          status: 'unread',
          createdAt: '2026-02-17T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to create message',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to create message',
        error: 'Internal server error',
      },
    },
  })
  create(@Body() createUserMessageDto: CreateUserMessageDto) {
    return this.userMessageService.create(createUserMessageDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all user messages' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Messages retrieved successfully',
        data: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            title: 'Inquiry about collaboration',
            message: 'I would love to discuss potential collaboration opportunities...',
            status: 'unread',
            createdAt: '2026-02-17T10:30:00.000Z',
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            title: 'Question about your services',
            message: 'Can you provide more details about your consulting services?',
            status: 'read',
            createdAt: '2026-02-16T14:20:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to retrieve messages',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to retrieve messages',
        error: 'Internal server error',
      },
    },
  })
  findAll() {
    return this.userMessageService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user message by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'Message retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Message retrieved successfully',
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          title: 'Inquiry about collaboration',
          message: 'I would love to discuss potential collaboration opportunities...',
          status: 'unread',
          createdAt: '2026-02-17T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Message with ID 1 not found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to retrieve message',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to retrieve message',
        error: 'Internal server error',
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userMessageService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user message' })
  @ApiParam({ name: 'id', type: 'number', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'Message updated successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Message updated successfully',
        data: {
          id: 1,
          name: 'John Doe Updated',
          email: 'john.updated@example.com',
          title: 'Updated inquiry about collaboration',
          message: 'Updated message content...',
          status: 'unread',
          createdAt: '2026-02-17T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Message with ID 1 not found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to update message',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to update message',
        error: 'Internal server error',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserMessageDto: UpdateUserMessageDto,
  ) {
    return this.userMessageService.update(id, updateUserMessageDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update message status' })
  @ApiParam({ name: 'id', type: 'number', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'Message status updated successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Message status updated successfully',
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          title: 'Inquiry about collaboration',
          message: 'I would love to discuss potential collaboration opportunities...',
          status: 'read',
          createdAt: '2026-02-17T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Message with ID 1 not found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to update message status',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to update message status',
        error: 'Internal server error',
      },
    },
  })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateStatusDto: UpdateStatusDto) {
    return this.userMessageService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user message' })
  @ApiParam({ name: 'id', type: 'number', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Message deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Message with ID 1 not found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to delete message',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to delete message',
        error: 'Internal server error',
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userMessageService.remove(id);
  }
}
