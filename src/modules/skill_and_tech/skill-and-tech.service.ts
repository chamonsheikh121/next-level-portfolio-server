import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Injectable()
export class SkillAndTechService {
  constructor(
    private prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ==================== SKILL APIs ====================

  /**
   * Create a new skill
   */
  async createSkill(createSkillDto: CreateSkillDto) {
    // Check if skill with same name already exists
    const existingSkill = await this.prismaService.client.skill.findUnique({
      where: { name: createSkillDto.name },
    });

    if (existingSkill) {
      throw new ConflictException(`Skill with name "${createSkillDto.name}" already exists`);
    }

    const skill = await this.prismaService.client.skill.create({
      data: createSkillDto,
      include: {
        technologies: true,
      },
    });

    return {
      success: true,
      message: 'Skill created successfully',
      data: skill,
    };
  }

  /**
   * Update a skill
   */
  async updateSkill(id: number, updateSkillDto: UpdateSkillDto) {
    // Check if skill exists
    const skill = await this.prismaService.client.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    // If updating name, check for conflicts
    if (updateSkillDto.name && updateSkillDto.name !== skill.name) {
      const existingSkill = await this.prismaService.client.skill.findUnique({
        where: { name: updateSkillDto.name },
      });

      if (existingSkill) {
        throw new ConflictException(`Skill with name "${updateSkillDto.name}" already exists`);
      }
    }

    const updatedSkill = await this.prismaService.client.skill.update({
      where: { id },
      data: updateSkillDto,
      include: {
        technologies: true,
      },
    });

    return {
      success: true,
      message: 'Skill updated successfully',
      data: updatedSkill,
    };
  }

  /**
   * Get all skills with all technologies
   */
  async getAllSkills() {
    const skills = await this.prismaService.client.skill.findMany({
      include: {
        technologies: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return {
      success: true,
      count: skills.length,
      data: skills,
    };
  }

  // ==================== TECHNOLOGY APIs ====================

  /**
   * Get all technologies
   */
  async getAllTechnologies() {
    const technologies = await this.prismaService.client.technology.findMany({
      include: {
        skill: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return {
      success: true,
      count: technologies.length,
      data: technologies,
    };
  }

  /**
   * Create a new technology
   */
  async createTechnology(createTechnologyDto: CreateTechnologyDto, file?: Express.Multer.File) {
    // Check if skill exists
    const skill = await this.prismaService.client.skill.findUnique({
      where: { id: createTechnologyDto.skillId },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID ${createTechnologyDto.skillId} not found`);
    }

    let iconUrl: string | undefined;

    // Upload icon to Cloudinary if file is provided
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/technologies');
      iconUrl = uploadResult.secure_url;
    }

    const technology = await this.prismaService.client.technology.create({
      data: {
        ...createTechnologyDto,
        ...(iconUrl && { iconUrl }),
      },
      include: {
        skill: true,
      },
    });

    return {
      success: true,
      message: 'Technology created successfully',
      data: technology,
    };
  }

  /**
   * Update a technology
   */
  async updateTechnology(id: number, updateTechnologyDto: UpdateTechnologyDto, file?: Express.Multer.File) {
    // Check if technology exists
    const technology = await this.prismaService.client.technology.findUnique({
      where: { id },
    });

    if (!technology) {
      throw new NotFoundException(`Technology with ID ${id} not found`);
    }

    // If updating skillId, check if the skill exists
    if (updateTechnologyDto.skillId) {
      const skill = await this.prismaService.client.skill.findUnique({
        where: { id: updateTechnologyDto.skillId },
      });

      if (!skill) {
        throw new NotFoundException(`Skill with ID ${updateTechnologyDto.skillId} not found`);
      }
    }

    let iconUrl: string | undefined;

    // Upload icon to Cloudinary if file is provided
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file, 'portfolio/technologies');
      iconUrl = uploadResult.secure_url;

      // Delete old icon from Cloudinary if it exists
      if (technology.iconUrl) {
        try {
          await this.cloudinaryService.deleteFile(technology.iconUrl);
        } catch (error) {
          // Log error but don't fail the update
          console.error('Failed to delete old icon from Cloudinary:', error);
        }
      }
    }

    const updatedTechnology = await this.prismaService.client.technology.update({
      where: { id },
      data: {
        ...updateTechnologyDto,
        ...(iconUrl && { iconUrl }),
      },
      include: {
        skill: true,
      },
    });

    return {
      success: true,
      message: 'Technology updated successfully',
      data: updatedTechnology,
    };
  }

  /**
   * Delete a technology
   */
  async deleteTechnology(id: number) {
    // Check if technology exists
    const technology = await this.prismaService.client.technology.findUnique({
      where: { id },
    });

    if (!technology) {
      throw new NotFoundException(`Technology with ID ${id} not found`);
    }

    await this.prismaService.client.technology.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Technology deleted successfully',
    };
  }
}
