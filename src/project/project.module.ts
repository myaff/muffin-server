import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { createProvider } from 'src/utils/createProviders';
import { REPOSITORY } from './constants';
import { Project } from './entities/project.entity';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [ProjectController],
  providers: [createProvider(REPOSITORY, Project), ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
