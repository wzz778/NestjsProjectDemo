import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}
  findAll(query: UserQeury) {
    //动态查询
    const { limit, page, username, gender, role } = query;
    const take = limit || 10;
    return this.userRepository.find({
      select: {
        //设置需要返回的数据
        id: true,
        username: true,
      },

      relations: {
        //设置连表查询
        profile: true,
        roles: true,
      },
      where: {
        //设置动态查询
        username,
        profile: {
          gender,
        },
        roles: {
          id: role,
        },
      },
      take, //设置分页条件
      skip: (page - 1) * take,
    });
  }
  find(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>) {
    if (!user.roles) {
      const role = await this.rolesRepository.findOne({ where: { id: 1 } });
      user.roles = [role];
    }
    if (user.roles instanceof Array && typeof user.roles[0] === 'number') {
      // {id, name} -> { id } -> [id]
      // 查询所有的用户角色
      user.roles = await this.rolesRepository.find({
        where: {
          id: In(user.roles),
        },
      });
    }
    const userTmp = this.userRepository.create(user);
    return this.userRepository.save(userTmp);
  }
  //Partial会拼接没有传的数据，相当于动态sql
  async update(id: number, user: Partial<User>) {
    const userTemp = await this.findAddProfile(id);
    const newUser = this.userRepository.merge(userTemp, user);
    // 联合模型更新，需要使用save方法或者queryBuilder
    return this.userRepository.save(newUser);
    1;
    // 下面的update方法，只适合单模型的更新，不适合有关系的模型更新
    // return this.userRepository.update(parseInt(id), newUser);
  }
  remove(id: number) {
    return this.userRepository.delete(id);
  }

  findAddProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
  }
}
