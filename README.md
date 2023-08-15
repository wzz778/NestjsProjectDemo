# 前言：

此 .md 博客是我对这两个星期学习nest.js框架的一个结构梳理，旨在讲个大概的项目结构，基本的结构和代码是用来干什么的，不能做到从 0 基础到完全完成Nest.js项目的初始化。

# 项目功能：

## 核心技术栈

**Nestjs + TypeORM + MySQL + Jwt + Docker**

## 功能

基本的一对一，多对多，一对多的数据库表连接，数据库链表查询，user类的完整crud，分页查询配置，jwt鉴权，密码加密处理。

> **旨在对node后端代码的一个相对完整的书写**

# 项目介绍

## 项目目录

![image.png](https://cdn.nlark.com/yuque/0/2023/png/26685644/1692106865341-649241d8-7ac6-45d9-ae4f-67c863ef782a.png#averageHue=%23272b2e&clientId=ubcc800f3-e335-4&from=paste&height=535&id=u553a9b30&originHeight=1183&originWidth=439&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=78369&status=done&style=none&taskId=u8190c8f8-e4da-4d5f-bb59-625765d43db&title=&width=198.5)

## 文件介绍

### 配置文件

![image.png](https://cdn.nlark.com/yuque/0/2023/png/26685644/1692107060546-a9010922-e814-4f83-bac8-bb0b0cecdb47.png#averageHue=%2326282b&clientId=ubcc800f3-e335-4&from=paste&height=325&id=u3a21623b&originHeight=650&originWidth=380&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=50591&status=done&style=none&taskId=u90ba709e-53e8-4e9e-a20c-bfc7351b011&title=&width=190)
这些文件就不做过多介绍了，有框架基础的应该都知道是干啥的，基本都是些项目框架的配置文件

### 中枢文件

![image.png](https://cdn.nlark.com/yuque/0/2023/png/26685644/1692108695964-8dce07fc-805e-4007-9069-0cf3389b4301.png#averageHue=%23282b2d&clientId=ubcc800f3-e335-4&from=paste&height=253&id=uf3f1a29a&originHeight=495&originWidth=446&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=24882&status=done&style=none&taskId=uca59ffbc-7501-4902-bdc4-37fd435e225&title=&width=228.33334350585938)

#### main.ts

主要负责框架 **代理启动** 服务器

#### app.module.ts

代码的中枢，完成 **数据库连接 **的各种连接配置

### 数据库与接口文件

结构类似于 springboot框架的结构，代码逻辑有比较明确的分级
user有较为标准的文件结构，咱们拿一个user类为例：

#### 文件目录

![image.png](https://cdn.nlark.com/yuque/0/2023/png/26685644/1692108572378-15e24a63-6d5e-4d20-a39d-f754f1ba4cfa.png#averageHue=%23242b30&clientId=ubcc800f3-e335-4&from=paste&height=285&id=u15029771&originHeight=634&originWidth=413&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=44779&status=done&style=none&taskId=u1b226f45-1898-4aa1-9821-bdc1ec1a7d4&title=&width=185.33334350585938)

#### xxx.module.ts

**连接user类接口的中枢**

```typescript
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

```

#### xxx.entity.ts

**创建数据库表的文件**

```typescript
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import { Profile } from './profile.entity';
// import { Roles } from '../roles/roles.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) //设置唯一账号
  username: string;

  @Column()
  password: string;

  // typescript -> 数据库 关联关系 Mapping，
  //一对多
  @OneToMany(() => Logs, (logs) => logs.user, { cascade: true })
  logs: Logs[];

  //多对多
  @ManyToMany(() => Roles, (roles) => roles.users, { cascade: ['insert'] })
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  //, { cascade: true }设置连表更新 一对一
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;
}

```

#### xxx.controller.ts（controller层，控制层）

**具体的业务模块流程的控制**，**接口请求入口**，controller层主要调用Service层里面的接口控制具体的业务流程，控制的配置也要在配置文件中进行。

```typescript
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

```

#### xxx.service.ts（service层，业务层）

**接口业务模块的逻辑应用设计**，和DAO层一样都是先设计接口，再创建要实现的类，然后在配置文件中进行配置其实现的关联。接下来就可以在service层调用接口进行业务逻辑应用的处理

#### dto（实体类，请求类）

### 工具文件

#### guards（守卫）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/26685644/1692109143744-0d224362-b5d1-422f-8241-a9a60b095d01.png#averageHue=%23212f3a&clientId=ubcc800f3-e335-4&from=paste&height=125&id=ucd3b738c&originHeight=188&originWidth=436&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=13205&status=done&style=none&taskId=ube77239d-e734-4f8c-b890-678cd59498c&title=&width=290.6666666666667)
完成的是全局 **jwt** 工具的封装，和指定**管理员 jwt 鉴权**函数工具的封装

#### filters（过滤器，接口返回封装）

接口**数据返回类型**的封装，配置，**请求日志**函数的封装

#### test（测试文件）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/26685644/1692109338450-a1d7c297-856b-48b6-a7ab-768af5a11bdc.png#averageHue=%231d3240&clientId=ubcc800f3-e335-4&from=paste&height=92&id=udd5f0bee&originHeight=138&originWidth=452&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=10130&status=done&style=none&taskId=u5273ad7e-88e9-4e1e-8616-e577363b13e&title=&width=301.3333333333333)

#### enum（数据枚举）

# 项目运行

## 运行环境

> 1. node环境
> 2. docker环境
> 3. mysql环境

这几个是项目运行的重要环境
关于安装docker环境遇见的问题，可以看我写过的一个博客：
[https://blog.csdn.net/Azbtt/article/details/132182380](https://blog.csdn.net/Azbtt/article/details/132182380)

## 运行配置

运行项目之前，请先自行配置本地的数据库环境，并修改项目根目录中的配置文件：`.env`，`.env.development`（开发），`.env.production`（生产）。
推荐使用`node14 LTS`安装依赖：

```
npm i
```

## 运行命令

运行项目：

```
npm run start:dev
```

# Github地址：

> [https://github.com/wzz778/NestjsProjectDemo](https://github.com/wzz778/NestjsProjectDemo)


学习视频地址：[慕课网实战课程 - 提升个人技术的真实项目演练](https://coding.imooc.com/learn/list/617.html)
