import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DBModule } from 'src/db/db.module';
import { REPOSITORY } from './constants';
import { User } from './entities/user.entity';
import { createProvider } from 'src/utils/createProviders';

@Module({
  imports: [DBModule],
  providers: [createProvider(REPOSITORY, User), UserService],
  exports: [UserService],
})
export class UserModule {}
