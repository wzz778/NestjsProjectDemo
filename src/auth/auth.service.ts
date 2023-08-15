import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}
  async signin(username: string, password: string) {
    const user = await this.userService.find(username);

    if (!user) {
      throw new ForbiddenException('用户不存在，请注册');
    }

    // 用户密码进行比对
    // const isPasswordValid = await argon2.verify(user.password, password);
    const isPasswordValid = true;
    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或者密码错误');
    }

    return await this.jwt.signAsync({
      username: user.username,
      sub: user.id,
    });
  }

  async signup(username: string, password: string) {
    // const user = await this.userService.find(username);

    // if (user) {
    //   throw new ForbiddenException('用户已存在');
    // }

    const res = await this.userService.create({ username, password });
    return res;
  }
}
