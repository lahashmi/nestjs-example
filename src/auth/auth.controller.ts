import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredDto } from './dtos/auth-cred.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) authCred: AuthCredDto): Promise<void> {
    return this.authService.signUpUser(authCred);
  }
  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authCred: AuthCredDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signInUser(authCred);
  }
}
