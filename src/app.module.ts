import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ClientModule } from './client/client.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { StatusModule } from './status/status.module';
import { TrackingModule } from './tracking/tracking.module';
import { CurrencyModule } from './currency/currency.module';
import { BankModule } from './bank/bank.module';
import { OrgformModule } from './orgform/orgform.module';
import { RateModule } from './rate/rate.module';

@Module({
  imports: [
    DBModule,
    AuthModule,
    UserModule,
    ClientModule,
    ProjectModule,
    TaskModule,
    StatusModule,
    TrackingModule,
    CurrencyModule,
    BankModule,
    OrgformModule,
    RateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
