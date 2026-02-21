import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { EmailQueueService } from '../../common/email/email-queue.service';
import { CreateHireRequestDto } from './dto/create-hire-request.dto';
import { UpdateHireRequestDto } from './dto/update-hire-request.dto';
import { HireRequestStatus } from './dto/update-status.dto';

@Injectable()
export class HireService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly emailQueueService: EmailQueueService,
  ) {}

  async create(createHireRequestDto: CreateHireRequestDto) {
    try {
      const hireRequest = await this.prisma.client.hireRequest.create({
        data: {
          ...createHireRequestDto,
          coreFeatures: createHireRequestDto.coreFeatures || [],
          techSuggestion: createHireRequestDto.techSuggestion || [],
        },
        include: {
          files: true,
        },
      });

      // Send notification email to admin only (not to client)
      await this.emailQueueService.sendAdminHireRequestNotification(
        hireRequest.name || 'New client',
        hireRequest.email,
        hireRequest.projectDesc || 'New project inquiry not submitted full query yet',
        hireRequest.companyName || 'New client',
        hireRequest.budget,
        hireRequest.timeline,
        hireRequest.coreFeatures || ["new client"],
        hireRequest.techSuggestion || ["new client"],
      );

      return {
        statusCode: 201,
        message: 'Hire request created successfully',
        data: hireRequest,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to create hire request',
        error: error.message,
      });
    }
  }

  async findAll() {
    try {
      const hireRequests = await this.prisma.client.hireRequest.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          files: true,
        },
      });

      return {
        statusCode: 200,
        message: 'Hire requests retrieved successfully',
        data: hireRequests,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to retrieve hire requests',
        error: error.message,
      });
    }
  }

  async findOne(id: number) {
    try {
      const hireRequest = await this.prisma.client.hireRequest.findUnique({
        where: { id },
        include: {
          files: true,
        },
      });

      if (!hireRequest) {
        throw new NotFoundException({
          statusCode: 404,
          message: `Hire request with ID ${id} not found`,
        });
      }

      return {
        statusCode: 200,
        message: 'Hire request retrieved successfully',
        data: hireRequest,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to retrieve hire request',
        error: error.message,
      });
    }
  }

  async update(
    id: number,
    updateHireRequestDto: UpdateHireRequestDto,
    files?: Express.Multer.File[],
  ) {
    try {
      const existingHireRequest = await this.prisma.client.hireRequest.findUnique({
        where: { id },
        include: {
          files: true,
        },
      });

      if (!existingHireRequest) {
        throw new NotFoundException({
          statusCode: 404,
          message: `Hire request with ID ${id} not found`,
        });
      }

      // Check if status is inprocess - if yes, we'll send emails and update to unread
      const wasInProcess = existingHireRequest.status === 'inprocess';

      // Upload files to Cloudinary if provided
      const uploadedFiles: any[] = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const uploadResult = await this.cloudinaryService.uploadDocument(
            file,
            'portfolio/hire-requests',
          );

          // Create file document in database with hireRequestId
          const fileDocument = await this.prisma.client.fileDocument.create({
            data: {
              url: uploadResult.secure_url,
              publicId: uploadResult.public_id,
              format: uploadResult.format,
              resourceType: uploadResult.resource_type,
              bytes: uploadResult.bytes,
              hireRequestId: id,
            },
          });

          uploadedFiles.push(fileDocument);
        }
      }

      // Prepare update data - if status was inprocess, change it to unread
      const updateData: any = { ...updateHireRequestDto };
      if (wasInProcess) {
        updateData.status = 'unread';
      }

      // Update hire request
      const updatedHireRequest = await this.prisma.client.hireRequest.update({
        where: { id },
        data: updateData,
        include: {
          files: true,
        },
      });

      // Send emails only if status was inprocess (first client update)
      if (wasInProcess) {
        // Send confirmation email to client
        await this.emailQueueService.sendHireRequestConfirmation(
          updatedHireRequest.email,
          updatedHireRequest.name,
          updatedHireRequest.projectDesc || 'Project inquiry',
          updatedHireRequest.budget,
          updatedHireRequest.timeline,
        );

        // Send notification email to admin
        await this.emailQueueService.sendAdminHireRequestNotification(
          updatedHireRequest.name,
          updatedHireRequest.email,
          updatedHireRequest.projectDesc || 'Project inquiry',
          updatedHireRequest.companyName,
          updatedHireRequest.budget,
          updatedHireRequest.timeline,
          updatedHireRequest.coreFeatures,
          updatedHireRequest.techSuggestion,
        );
      }

      return {
        statusCode: 200,
        message: 'Hire request updated successfully',
        data: updatedHireRequest,
        uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to update hire request',
        error: error.message,
      });
    }
  }

  async updateStatus(id: number, status: HireRequestStatus) {
    try {
      const existingHireRequest = await this.prisma.client.hireRequest.findUnique({
        where: { id },
      });

      if (!existingHireRequest) {
        throw new NotFoundException({
          statusCode: 404,
          message: `Hire request with ID ${id} not found`,
        });
      }

      const updatedHireRequest = await this.prisma.client.hireRequest.update({
        where: { id },
        data: { status },
        include: {
          files: true,
        },
      });

      return {
        statusCode: 200,
        message: 'Hire request status updated successfully',
        data: updatedHireRequest,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to update hire request status',
        error: error.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const existingHireRequest = await this.prisma.client.hireRequest.findUnique({
        where: { id },
        include: {
          files: true,
        },
      });

      if (!existingHireRequest) {
        throw new NotFoundException({
          statusCode: 404,
          message: `Hire request with ID ${id} not found`,
        });
      }

      // Delete associated files from Cloudinary and database
      for (const fileDocument of existingHireRequest.files) {
        if (fileDocument.publicId) {
          await this.cloudinaryService.deleteFile(fileDocument.publicId, 'raw');
        }

        // Delete file document
        await this.prisma.client.fileDocument.delete({
          where: { id: fileDocument.id },
        });
      }

      // Delete hire request
      await this.prisma.client.hireRequest.delete({
        where: { id },
      });

      return {
        statusCode: 200,
        message: 'Hire request deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to delete hire request',
        error: error.message,
      });
    }
  }
}
