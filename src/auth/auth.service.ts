import { BadRequestException, Injectable, InternalServerErrorException, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as Crypto from 'crypto-js';
import { User } from 'src/user/entities/user.entity';
import { ACCESS_LIFESPAN, REFRESH_LIFESPAN } from './constats';

enum JwtSubjects {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneBy({ email });
    if (!user || this.encodePassword(password) !== user.password) throw new UnauthorizedException();
    try {
      const updatedUser = await this.userService.update(user.id, { audience: user.audience + 1 });
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
      .then(user => this.userService.transformToPublic(user));
  }

  async refreshToken(token: string) {
    const decoded = await this.jwtService.verify(token);
    if (decoded?.sub !== JwtSubjects.REFRESH || !decoded?.iss || !decoded.aud) throw new BadRequestException();
    const user = await this.userService.findOneBy({ id: decoded.iss });
    if (!user) throw new BadRequestException();
    if (user.audience !== decoded.aud) throw new NotAcceptableException();
    try {
      const updatedUser = await this.userService.update(user.id, { audience: user.audience + 1 });
      if (!updatedUser) throw new InternalServerErrorException();
      return this.getTokens(updatedUser);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  private encodePassword(password: string) {
    return Crypto.HmacSHA256(password, process.env.CRYPTO_SECRET).toString();
  }

  private async getTokens(user: User) {
    const iat = Date.now();
    const accessTokenPayload = {
      sub: JwtSubjects.ACCESS,
      iss: user.id,
      email: user.email,
      iat,
      exp: iat + ACCESS_LIFESPAN,
    };
    const refreshTokenPayload = {
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
