import { PartialType } from '@nestjs/mapped-types';
import { CreateRateVersionDto } from './create-rate-version.dto';

export class UpdateRateVersionDto extends PartialType(CreateRateVersionDto) {}
