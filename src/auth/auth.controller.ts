import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { SigninUserDto } from './ato/signin-user.dto';

@Controller('auth')
@UseFilters(new TypeormFilter()) //错误 信息返回封装
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signin(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }

  @Post('/signup')
  signup(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    return this.authService.signup(username, password);
  }
}
