import { Module } from '@nestjs/common';
import { OrgformService } from './orgform.service';
import { OrgformController } from './orgform.controller';
import { DBModule } from 'src/db/db.module';
import { createProvider } from 'src/utils/createProviders';
import { REPOSITORY } from './constants';
import { Orgform } from './entities/orgform.entity';

@Module({
  imports: [DBModule],
  controllers: [OrgformController],
  providers: [createProvider(REPOSITORY, Orgform), OrgformService],
})
export class OrgformModule {}
