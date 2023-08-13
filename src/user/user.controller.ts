import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { Logger } from 'nestjs-pino';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('user')
@UseFilters(new TypeormFilter()) //错误 信息返回封装
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private logger: Logger,
  ) {
    this.logger.log('User');
  }

  @Get()
  getUsers(@Query() query: UserQeury): any {
    //分页查询
    return this.userService.findAll(query);
  }

  @Post()
  addUser(@Body() dto: any): any {
    //@Body data参数
    // todo 解析Body参数
    const user = dto as User;
    return this.userService.create(user);
  }
  @Patch('/:id')
  updateUser(@Body() dto: any, @Param('id') id: number): any {
    // todo 传递参数id
    // todo 异常处理
    const user = dto as User;
    return this.userService.update(id, user);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number): any {
    // todo 传递参数id
    return this.userService.remove(id);
  }

  @Get('/findAddProfile')
  findAddProfile(@Query() query: any): any {
    return this.userService.findAddProfile(query.id);
  }
}
