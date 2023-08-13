import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async signin(username: string, password: string) {
    const res = await this.userService.findAll({ username } as UserQeury);
    return res;
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
