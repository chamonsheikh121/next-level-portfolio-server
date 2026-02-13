import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ==================== PROJECT TYPE ENDPOINTS ====================

  async createProjectType(createProjectTypeDto: CreateProjectTypeDto) {
    try {
      // Check if type with this title already exists
      const existingType = await this.prisma.client.projectType.findFirst({
        where: { title: createProjectTypeDto.title },
      });

      if (existingType) {
        throw new ConflictException(
          `Project type with title "${createProjectTypeDto.title}" already exists`,
        );
      }

      const projectType = await this.prisma.client.projectType.create({
        data: createProjectTypeDto,
      });

      return projectType;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create project type: ${error.message}`);
    }
  }

  async findAllProjectTypes() {
    try {
      const projectTypes = await this.prisma.client.projectType.findMany({
        include: {
          _count: {
            select: { projects: true },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });

      return projectTypes;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch project types: ${error.message}`);
    }
  }

  async updateProjectType(id: number, updateProjectTypeDto: UpdateProjectTypeDto) {
    try {
      // Check if project type exists
      const existingType = await this.prisma.client.projectType.findUnique({
        where: { id },
      });

      if (!existingType) {
        throw new NotFoundException(`Project type with ID ${id} not found`);
      }

      // Check if updating to a title that already exists
      if (updateProjectTypeDto.title) {
        const duplicateType = await this.prisma.client.projectType.findFirst({
          where: {
            title: updateProjectTypeDto.title,
            NOT: { id },
          },
        });

        if (duplicateType) {
          throw new ConflictException(
            `Project type with title "${updateProjectTypeDto.title}" already exists`,
          );
        }
      }

      const updatedType = await this.prisma.client.projectType.update({
        where: { id },
        data: updateProjectTypeDto,
      });

      return updatedType;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update project type: ${error.message}`);
    }
  }

  // ==================== PROJECT ENDPOINTS ====================

  async create(createProjectDto: CreateProjectDto, file?: Express.Multer.File) {
    try {
      // Check if project type exists
      const projectType = await this.prisma.client.projectType.findUnique({
        where: { id: createProjectDto.typeId },
      });

      if (!projectType) {
        throw new NotFoundException(`Project type with ID ${createProjectDto.typeId} not found`);
      }

      let imageURL: string | undefined;

      // Upload image to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/projects');
        imageURL = uploadResult.secure_url;
      }

      const project = await this.prisma.client.project.create({
        data: {
          ...createProjectDto,
          imageURL,
          frontendTechs: createProjectDto.frontendTechs || [],
          backendTechs: createProjectDto.backendTechs || [],
          devopsTechs: createProjectDto.devopsTechs || [],
          designTechs: createProjectDto.designTechs || [],
          othersTechs: createProjectDto.othersTechs || [],
          keyAccomplishments: createProjectDto.keyAccomplishments || [],
          problems: createProjectDto.problems || {},
          solutions: createProjectDto.solutions || {},
          solutionArchitecture: createProjectDto.solutionArchitecture || {},
          challenges: createProjectDto.challenges || {},
        },
        include: {
          type: true,
        },
      });

      return project;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create project: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const projects = await this.prisma.client.project.findMany({
        include: {
          type: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      return projects;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch projects: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const project = await this.prisma.client.project.findUnique({
        where: { id },
        include: {
          type: true,
        },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch project: ${error.message}`);
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, file?: Express.Multer.File) {
    try {
      // Check if project exists
      const existingProject = await this.findOne(id);

      // Check if project type exists (if typeId is being updated)
      if (updateProjectDto.typeId) {
        const projectType = await this.prisma.client.projectType.findUnique({
          where: { id: updateProjectDto.typeId },
        });

        if (!projectType) {
          throw new NotFoundException(`Project type with ID ${updateProjectDto.typeId} not found`);
        }
      }

      let imageURL: string | undefined;

      // Upload new image to Cloudinary if file is provided
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/projects');
        imageURL = uploadResult.secure_url;

        // Delete old image from Cloudinary if it exists
        if (existingProject.imageURL) {
          try {
            await this.cloudinaryService.deleteFile(existingProject.imageURL);
          } catch (error) {
            console.error('Failed to delete old image:', error.message);
          }
        }
      }

      const updatedProject = await this.prisma.client.project.update({
        where: { id },
        data: {
          ...updateProjectDto,
          ...(imageURL && { imageURL }),
          ...(updateProjectDto.frontendTechs && { frontendTechs: updateProjectDto.frontendTechs }),
          ...(updateProjectDto.backendTechs && { backendTechs: updateProjectDto.backendTechs }),
          ...(updateProjectDto.devopsTechs && { devopsTechs: updateProjectDto.devopsTechs }),
          ...(updateProjectDto.designTechs && { designTechs: updateProjectDto.designTechs }),
          ...(updateProjectDto.othersTechs && { othersTechs: updateProjectDto.othersTechs }),
          ...(updateProjectDto.keyAccomplishments && {
            keyAccomplishments: updateProjectDto.keyAccomplishments,
          }),
          ...(updateProjectDto.problems && { problems: updateProjectDto.problems }),
          ...(updateProjectDto.solutions && { solutions: updateProjectDto.solutions }),
          ...(updateProjectDto.solutionArchitecture && {
            solutionArchitecture: updateProjectDto.solutionArchitecture,
          }),
          ...(updateProjectDto.challenges && { challenges: updateProjectDto.challenges }),
        },
        include: {
          type: true,
        },
      });

      return updatedProject;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update project: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      // Check if project exists
      const existingProject = await this.findOne(id);

      // Delete image from Cloudinary if it exists
      if (existingProject.imageURL) {
        try {
          await this.cloudinaryService.deleteFile(existingProject.imageURL);
        } catch (error) {
          console.error('Failed to delete image:', error.message);
        }
      }

      await this.prisma.client.project.delete({
        where: { id },
      });

      return { message: `Project with ID ${id} has been deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete project: ${error.message}`);
    }
  }
}
