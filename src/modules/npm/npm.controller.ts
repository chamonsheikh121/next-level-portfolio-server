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
import { NpmService } from './npm.service';
import { CreateNpmTypeDto } from './dto/create-npm-type.dto';
import { UpdateNpmTypeDto } from './dto/update-npm-type.dto';
import { CreateNpmPackageDto } from './dto/create-npm-package.dto';
import { UpdateNpmPackageDto } from './dto/update-npm-package.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('npm')
@Controller('npm')
export class NpmController {
  constructor(private readonly npmService: NpmService) {}

  // NPM Type endpoints
  @Post('types')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new NPM type' })
  @ApiResponse({
    status: 201,
    description: 'NPM type created successfully',
    schema: {
      example: {
        id: 1,
        title: 'React Components',
      },
    },
  })
  createType(@Body() createNpmTypeDto: CreateNpmTypeDto) {
    return this.npmService.createType(createNpmTypeDto);
  }

  @Get('types')
  @Public()
  @ApiOperation({ summary: 'Get all NPM types' })
  @ApiResponse({
    status: 200,
    description: 'NPM types retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          title: 'React Components',
          _count: {
            packages: 5,
          },
        },
      ],
    },
  })
  findAllTypes() {
    return this.npmService.findAllTypes();
  }

  @Get('types/:id')
  @Public()
  @ApiOperation({ summary: 'Get NPM type by ID' })
  @ApiParam({ name: 'id', description: 'NPM Type ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'NPM type retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'NPM type not found',
  })
  findOneType(@Param('id', ParseIntPipe) id: number) {
    return this.npmService.findOneType(id);
  }

  @Patch('types/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update NPM type' })
  @ApiParam({ name: 'id', description: 'NPM Type ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'NPM type updated successfully',
  })
  updateType(@Param('id', ParseIntPipe) id: number, @Body() updateNpmTypeDto: UpdateNpmTypeDto) {
    return this.npmService.updateType(id, updateNpmTypeDto);
  }

  @Delete('types/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete NPM type' })
  @ApiParam({ name: 'id', description: 'NPM Type ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'NPM type deleted successfully',
    schema: {
      example: {
        message: 'NPM type with ID 1 has been deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'NPM type has associated packages',
  })
  removeType(@Param('id', ParseIntPipe) id: number) {
    return this.npmService.removeType(id);
  }

  // NPM Package endpoints
  @Post('packages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new NPM package' })
  @ApiResponse({
    status: 201,
    description: 'NPM package created successfully',
    schema: {
      example: {
        id: 1,
        npmTypeId: 1,
        npmType: {
          id: 1,
          title: 'React Components',
        },
        title: 'React Data Table Component',
        version: '1.0.0',
        description: 'A powerful data table component',
        liveURL: 'https://example.com/demo',
        githubUrl: 'https://github.com/username/package',
        installable: 'npm install react-data-table',
        tags: ['react', 'table', 'component'],
      },
    },
  })
  createPackage(@Body() createNpmPackageDto: CreateNpmPackageDto) {
    return this.npmService.createPackage(createNpmPackageDto);
  }

  @Get('packages')
  @Public()
  @ApiOperation({ summary: 'Get all NPM packages' })
  @ApiResponse({
    status: 200,
    description: 'NPM packages retrieved successfully',
  })
  findAllPackages() {
    return this.npmService.findAllPackages();
  }

  @Get('packages/:id')
  @Public()
  @ApiOperation({ summary: 'Get NPM package by ID' })
  @ApiParam({ name: 'id', description: 'NPM Package ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'NPM package retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'NPM package not found',
  })
  findOnePackage(@Param('id', ParseIntPipe) id: number) {
    return this.npmService.findOnePackage(id);
  }

  @Patch('packages/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update NPM package' })
  @ApiParam({ name: 'id', description: 'NPM Package ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'NPM package updated successfully',
  })
  updatePackage(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNpmPackageDto: UpdateNpmPackageDto,
  ) {
    return this.npmService.updatePackage(id, updateNpmPackageDto);
  }

  @Delete('packages/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete NPM package' })
  @ApiParam({ name: 'id', description: 'NPM Package ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'NPM package deleted successfully',
    schema: {
      example: {
        message: 'NPM package with ID 1 has been deleted successfully',
      },
    },
  })
  removePackage(@Param('id', ParseIntPipe) id: number) {
    return this.npmService.removePackage(id);
  }
}
