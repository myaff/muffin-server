import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { REPOSITORY } from './constants';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: Repository<User>
  ) {}

  findOneBy(options: FindOptionsWhere<User>): Promise<User | undefined> {
    return this.repository.findOne({
      where: options,
      relations: { currency: true },
    });
  }

  create(userDto: CreateUserDto) {
    return this.repository.save(userDto);
  }

  update(id: number, userDto: UpdateUserDto) {
    return this.repository
      .update({ id }, userDto)
      .then(res => {
        if (res.affected) return this.findOneBy({ id });
        else throw new InternalServerErrorException();
      });
  }

  transformToPublic(user: User | undefined | null) {
    if (!user) return null;
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
      lang: user.lang,
      currency: user.currency,
    }
  }
}
