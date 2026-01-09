import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      verifyOptions: {
        clockTolerance: 3000,
        ignoreNotBefore: true,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [{ provide: 'APP_GUARD', useClass: AuthGuard }, AuthService],
})
export class AuthModule {}
