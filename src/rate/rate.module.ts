import { Module } from '@nestjs/common';
import { RateController } from './rate.controller';
import { DBModule } from 'src/db/db.module';
import { createProvider } from 'src/utils/createProviders';
import { PLAN_REPOSITORY, VERSION_REPOSITORY } from './constants';
import { RatePlanService } from './rate-plan.service';
import { RateVersionService } from './rate-version.service';
import { RatePlan } from './entities/rate-plan.entity';
import { RateVersion } from './entities/rate-version.entity';
import { ClientModule } from 'src/client/client.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [DBModule, ClientModule, ProjectModule],
  controllers: [RateController],
  providers: [
    createProvider(PLAN_REPOSITORY, RatePlan), RatePlanService,
    createProvider(VERSION_REPOSITORY, RateVersion), RateVersionService,
  ],
  exports: [RatePlanService, RateVersionService],
})
export class RateModule {}
