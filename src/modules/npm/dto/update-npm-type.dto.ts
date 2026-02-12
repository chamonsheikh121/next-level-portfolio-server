import { PartialType } from '@nestjs/swagger';
import { CreateNpmTypeDto } from './create-npm-type.dto';

export class UpdateNpmTypeDto extends PartialType(CreateNpmTypeDto) {}
