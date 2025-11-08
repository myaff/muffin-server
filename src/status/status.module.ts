import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { createProvider } from 'src/utils/createProviders';
import { REPOSITORY } from './constants';
import { Status } from './entities/status.entity';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [StatusController],
  providers: [createProvider(REPOSITORY, Status), StatusService],
})
export class StatusModule {}
