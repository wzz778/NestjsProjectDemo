import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
//user的pip管道
@Injectable()
export class CreateUserPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    if (value.roles && value.roles instanceof Array && value.roles.length > 0) {
      // Roles[]
      if (value.roles[0]['id']) {
        value.roles = value.roles.map((role) => role.id);
      }
      // number[]
    }
    return value;
  }
}
