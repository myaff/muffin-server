import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { DBModule } from 'src/db/db.module';
import { createProvider } from 'src/utils/createProviders';
import { REPOSITORY } from './constants';
import { Rate } from './entities/rate.entity';

@Module({
  imports: [DBModule],
  controllers: [RateController],
  providers: [createProvider(REPOSITORY, Rate), RateService],
  exports: [RateService],
})
export class RateModule {}
