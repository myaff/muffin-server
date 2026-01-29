import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { createProvider } from 'src/utils/createProviders';
import { REPOSITORY } from './constants';
import { Client } from './entities/client.entity';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [ClientController],
  providers: [createProvider(REPOSITORY, Client), ClientService],
  exports: [ClientService],
})
export class ClientModule {}
