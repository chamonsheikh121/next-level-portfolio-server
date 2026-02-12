import { PartialType } from '@nestjs/swagger';
import { CreateNpmPackageDto } from './create-npm-package.dto';

export class UpdateNpmPackageDto extends PartialType(CreateNpmPackageDto) {}
