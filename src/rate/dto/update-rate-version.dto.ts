import { PartialType } from '@nestjs/mapped-types';
import { CreateRateVersionApi, CreateRateVersionDto } from './create-rate-version.dto';

export class UpdateRateVersionApi extends PartialType(CreateRateVersionApi) {}

export type UpdateRateVersionDto = Partial<CreateRateVersionDto>;
