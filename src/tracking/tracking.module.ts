import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { DBModule } from 'src/db/db.module';
import { createProvider } from 'src/utils/createProviders';
import { REPOSITORY } from './constants';
import { Tracking } from './entities/tracking.entity';

@Module({
  imports: [DBModule],
  controllers: [TrackingController],
  providers: [createProvider(REPOSITORY, Tracking), TrackingService],
})
export class TrackingModule {}
