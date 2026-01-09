import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { HmacSHA256 } from 'crypto-es';
import { User } from 'src/user/entities/user.entity';
import { ACCESS_LIFESPAN, REFRESH_LIFESPAN } from './constats';
import { JwtObjectRefresh, JwtSubjects, JwtObjectAccess } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneBy({ email });
    if (!user || user?.password !== this.encodePassword(password)) {
      throw new UnauthorizedException();
    }
    try {
      const updatedUser = await this.userService.update(user.id, {
        audience: user.audience + 1,
      });
      if (!updatedUser) throw new InternalServerErrorException();
      return this.getTokens(updatedUser);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async signUp(userDto: CreateUserDto) {
    try {
      const user = await this.userService.create({
        ...userDto,
        password: this.encodePassword(userDto.password),
      });
      return this.getTokens(user);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  getUser(id: number) {
    return this.userService
      .findOneBy({ id })
      .then((user) => this.userService.transformToPublic(user));
  }

  async refreshToken(token: string) {
    const decoded = this.jwtService.verify<JwtObjectRefresh>(token);
    if (decoded?.sub !== JwtSubjects.REFRESH || !decoded?.iss || !decoded.aud)
      throw new BadRequestException();
    const user = await this.userService.findOneBy({ id: decoded.iss });
    if (!user) throw new BadRequestException();
    if (user.audience !== decoded.aud) throw new NotAcceptableException();
    try {
      const updatedUser = await this.userService.update(user.id, {
        audience: user.audience + 1,
      });
      if (!updatedUser) throw new InternalServerErrorException();
      return this.getTokens(updatedUser);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  private encodePassword(password: string) {
    const secret = process.env.CRYPTO_SECRET ?? '';
    return HmacSHA256(password, secret).toString();
  }

  private async getTokens(user: User) {
    const iat = Date.now();
    const accessTokenPayload: JwtObjectAccess = {
      sub: JwtSubjects.ACCESS,
      iss: user.id,
      email: user.email,
      iat,
      exp: iat + ACCESS_LIFESPAN,
    };
    const refreshTokenPayload: JwtObjectRefresh = {
      sub: JwtSubjects.REFRESH,
      iss: user.id,
      aud: user.audience,
      iat,
      exp: iat + REFRESH_LIFESPAN,
    };
    return {
      accessToken: {
        token: await this.jwtService.signAsync(accessTokenPayload),
        expiresAt: iat + ACCESS_LIFESPAN,
      },
      refreshToken: {
        token: await this.jwtService.signAsync(refreshTokenPayload),
        expiresAt: iat + REFRESH_LIFESPAN,
      },
    };
  }
}
