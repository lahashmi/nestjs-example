import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredDto } from './dtos/auth-cred.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUpUser(authCred: AuthCredDto): Promise<void> {
    return this.userRepository.signUp(authCred);
  }

  async signInUser(authCred: AuthCredDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(authCred);
    console.log(username);
    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
