import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateClientProjectDto } from './dto/create-client-project.dto';
import { UpdateClientProjectDto } from './dto/update-client-project.dto';

@Injectable()
export class ClientProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientProjectDto: CreateClientProjectDto) {
    try {
      // Verify category exists
      const category = await this.prisma.client.clientProjectCategory.findUnique({
        where: { id: createClientProjectDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createClientProjectDto.categoryId} not found`,
        );
      }

      const project = await this.prisma.client.clientProject.create({
        data: {
          projectName: createClientProjectDto.projectName,
          description: createClientProjectDto.description,
          clientName: createClientProjectDto.clientName,
          userEmail: createClientProjectDto.userEmail,
          categoryId: createClientProjectDto.categoryId,
          status: createClientProjectDto.status,
          phase: createClientProjectDto.phase,
          deadline: new Date(createClientProjectDto.deadline),
          budget: createClientProjectDto.budget,
          projectDetailsLink: createClientProjectDto.projectDetailsLink,
        },
        include: {
          category: true,
        },
      });

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create client project: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const projects = await this.prisma.client.clientProject.findMany({
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return projects;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch client projects: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const project = await this.prisma.client.clientProject.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!project) {
        throw new NotFoundException(`Client project with ID ${id} not found`);
      }

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch client project: ${error.message}`);
    }
  }

  async findByCategory(categoryId: number) {
    try {
      const projects = await this.prisma.client.clientProject.findMany({
        where: { categoryId },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return projects;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch projects by category: ${error.message}`,
      );
    }
  }

  async findByStatus(status: string) {
    try {
      const projects = await this.prisma.client.clientProject.findMany({
        where: { status: status as any },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return projects;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch projects by status: ${error.message}`,
      );
    }
  }

  async update(id: number, updateClientProjectDto: UpdateClientProjectDto) {
    try {
      // Check if project exists
      await this.findOne(id);

      // Verify category exists if categoryId is being updated
      if (updateClientProjectDto.categoryId) {
        const category = await this.prisma.client.clientProjectCategory.findUnique({
          where: { id: updateClientProjectDto.categoryId },
        });

        if (!category) {
          throw new NotFoundException(
            `Category with ID ${updateClientProjectDto.categoryId} not found`,
          );
        }
      }

      // Build update data object
      const updateData: any = {};
      if (updateClientProjectDto.projectName)
        updateData.projectName = updateClientProjectDto.projectName;
      if (updateClientProjectDto.description)
        updateData.description = updateClientProjectDto.description;
      if (updateClientProjectDto.clientName)
        updateData.clientName = updateClientProjectDto.clientName;
      if (updateClientProjectDto.userEmail) updateData.userEmail = updateClientProjectDto.userEmail;
      if (updateClientProjectDto.categoryId)
        updateData.categoryId = updateClientProjectDto.categoryId;
      if (updateClientProjectDto.status) updateData.status = updateClientProjectDto.status;
      if (updateClientProjectDto.phase) updateData.phase = updateClientProjectDto.phase;
      if (updateClientProjectDto.deadline)
        updateData.deadline = new Date(updateClientProjectDto.deadline);
      if (updateClientProjectDto.budget !== undefined)
        updateData.budget = updateClientProjectDto.budget;
      if (updateClientProjectDto.projectDetailsLink)
        updateData.projectDetailsLink = updateClientProjectDto.projectDetailsLink;

      const updatedProject = await this.prisma.client.clientProject.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
        },
      });

      return updatedProject;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update client project: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      // Check if project exists
      await this.findOne(id);

      await this.prisma.client.clientProject.delete({
        where: { id },
      });

      return {
        message: `Client project with ID ${id} has been deleted successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete client project: ${error.message}`);
    }
  }
}
