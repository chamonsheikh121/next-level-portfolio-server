import { PartialType } from '@nestjs/swagger';
import { CreateClientProjectCategoryDto } from './create-client-project-category.dto';

export class UpdateClientProjectCategoryDto extends PartialType(CreateClientProjectCategoryDto) {}
