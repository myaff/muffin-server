import { PartialType } from '@nestjs/mapped-types';
import { CreateOrgformDto } from './create-orgform.dto';

export class UpdateOrgformDto extends PartialType(CreateOrgformDto) {}
