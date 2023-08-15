import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
// import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private configService: ConfigService, // @InjectRedis() private readonly redis: Redis,
  ) {
    super();
  }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   // custom logic can go here
  //   const request = context.switchToHttp().getRequest();
  //   const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
  //   // const cacheToken = this.redis.get(token);
  //   if (!token) {
  //     throw new UnauthorizedException();
  //   }
  //   const payload = await verify(
  //     token,
  //     this.configService.get(ConfigEnum.SECRET),
  //   );
  //   const username = payload['username'];
  //   const tokenCache = username ? await this.redis.get(username) : null;
  //   if (!payload || !username || tokenCache !== token) {
  //     throw new UnauthorizedException();
  //   }

  //   const parentCanActivate = (await super.canActivate(context)) as boolean; // this is necessary due to possibly returning `boolean | Promise<boolean> | Observable<boolean>
  //   // custom logic goes here too
  //   return parentCanActivate;
  // }
}

// 装饰器
// @JwtGuard()
