import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { LoggerModule } from 'nestjs-pino'; //日志打印工具
import { Roles } from 'src/roles/roles.entity';
import { Logs } from 'src/logs/logs.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Logs, Roles]),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty', //打印日志样式优化
          options: {
            colorize: true,
          },
        },
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
