import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredDto } from './dtos/auth-cred.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCred: AuthCredDto): Promise<void> {
    const user = new User();
    user.username = authCred.username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(authCred.password, user.salt);
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCred: AuthCredDto): Promise<string> {
    const { username, password } = authCred;
    const user = await this.findOne({ username });

    const isPassValid = await user.validateUserPassword(password);

    if (user && isPassValid) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
