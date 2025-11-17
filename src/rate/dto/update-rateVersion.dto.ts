import { PartialType } from '@nestjs/mapped-types';
import { CreateRateVersionDto } from './create-rateVersion.dto';

export class UpdateRateVersionDto extends PartialType(CreateRateVersionDto) {}
