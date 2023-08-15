import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { Logger } from 'nestjs-pino';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../guards/admin/admin.guard';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('user')
@UseFilters(new TypeormFilter()) //错误 信息返回封装
@UseGuards(JwtGuard) //守卫，设置token
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
  //
  @Post()
  addUser(@Body(CreateUserPipe) dto: CreateUserDto): any {
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

  @UseGuards(AdminGuard) //管理员守卫，不是id为2的不行
  @Delete('/:id')
  deleteUser(@Param('id') id: number): any {
    // todo 传递参数id
    return this.userService.remove(id);
  }

  //ParseIntPipe 管道，将 id 转换成数字形式
  @Get('/findAddProfile')
  findAddProfile(@Query('id', ParseIntPipe) query: any): any {
    return this.userService.findAddProfile(query.id);
  }
}
