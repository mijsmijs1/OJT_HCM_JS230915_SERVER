import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
//
// Hàm toValidate nhận một tham số là metatype, đại diện cho kiểu dữ liệu của một thuộc tính trong class DTO (Data Transfer Object). Ý nghĩa của hàm này là kiểm tra xem kiểu dữ liệu của thuộc tính có thuộc vào danh sách các kiểu dữ liệu cơ bản hay không. Dưới đây là giải thích chi tiết:

// metatype: Đây là một đối tượng kiểu Function, đại diện cho kiểu dữ liệu của một thuộc tính trong class DTO.

// types: Mảng này chứa các kiểu dữ liệu cơ bản mà chúng ta không cần thực hiện validation sâu hơn, bao gồm String, Boolean, Number, Array, và Object.

// return value: Hàm này trả về true nếu metatype không thuộc vào danh sách các kiểu dữ liệu cơ bản, và false nếu metatype thuộc vào danh sách đó.
function toValidate(metatype: Function): boolean {
  const types: Function[] = [String, Boolean, Number, Array, Object];
  return !types.includes(metatype);
}

@Injectable()
export class ValidationBodyPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (type !== 'body') {
      return value;
    }
    if (!metatype || !toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      if (errors[0].constraints) {
        throw new BadRequestException(
          errors[0].constraints[Object.keys(errors[0].constraints)[0]],
        );
      } else if (errors[0].children.length > 0) {
        findError(errors[0].children);
      }
    }
    return object;
  }
}

@Injectable()
export class ValidationQueryPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (type !== 'query') {
      return value;
    }
    if (!metatype || !toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      if (errors[0].constraints) {
        throw new BadRequestException(
          errors[0].constraints[Object.keys(errors[0].constraints)[0]],
        );
      } else if (errors[0].children.length > 0) {
        findError(errors[0].children);
      }
    }
    return value;
  }
}

function findError(currentNode) {
  for (const index in currentNode[0].children) {
    const node = currentNode[0].children[index];
    if (node.constraints) {
      throw new BadRequestException(
        node.constraints[Object.keys(node.constraints)[0]],
      );
    }
    findError(node);
  }
}



// import { Controller, Post, Query, Body } from '@nestjs/common';
// import { ValidationBodyPipe, ValidationQueryPipe } from './validation.pipes';
// import { CreateUserDto } from './create-user.dto';

// @Controller('users')
// export class UsersController {
//   @Post()
//   async createUser(@Body(new ValidationBodyPipe()) userData: CreateUserDto) {
//     // Nếu dữ liệu trong request body không hợp lệ, pipe sẽ throw một BadRequestException
//     // Nếu hợp lệ, userData sẽ được chuyển đổi thành một instance của CreateUserDto
//     // và sẽ được sử dụng để tạo mới một user trong hệ thống
//   }

//   @Get()
//   async getUsers(@Query(new ValidationQueryPipe()) query: any) {
//     // Tương tự như trên, nếu dữ liệu trong query params không hợp lệ, pipe sẽ throw một BadRequestException
//     // Nếu hợp lệ, dữ liệu sẽ được sử dụng để truy vấn danh sách người dùng từ hệ thống
//   }
// }
