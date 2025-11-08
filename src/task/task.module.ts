import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { createProvider } from 'src/utils/createProviders';
import { REPOSITORY } from './constants';
import { Task } from './entities/task.entity';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [TaskController],
  providers: [createProvider(REPOSITORY, Task), TaskService],
})
export class TaskModule {}
