import { PartialType } from '@nestjs/mapped-types';
import { CreateRatePlanDto } from './create-ratePlan.dto';

export class UpdateRatePlanDto extends PartialType(CreateRatePlanDto) {}
