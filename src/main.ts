// Copyright (c) 2022 toimc<admin@wayearn.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const httpAdapter = app.get(HttpAdapterHost);
  // 全局Filter只能有一个
  const logger = new Logger();
  // app.useGlobalFilters(new HttpExceptionFilter(logger));
  // app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段
      // whitelist: true,
    }),
  );
  await app.listen(3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
