import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUsers(): any {
    // const data = this.configService.get('dbs');
    // // const host = this.configService.get(ConfgEnum.DB_HOST);
    // console.log('222', data);
    const url = this.configService.get('DB_URL');
    console.log(
      '🚀 ~ file: user.controller.ts ~ line 23 ~ UserController ~ getUsers ~ url',
      url,
    );
    return this.userService.getUsers();
  }

  @Post()
  addUser(): any {
    return this.userService.addUser();
  }
}
