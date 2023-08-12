import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
    return this.userRepository.findOne({ where: { username } });
  }
  async create(user: User) {
    const userTmp = this.userRepository.create(user);
    return this.userRepository.save(userTmp);
  }
  //Partial会拼接没有传的数据，相当于动态sql
  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
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
