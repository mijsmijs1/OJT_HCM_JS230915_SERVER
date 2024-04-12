import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { CreateUserDto } from "src/modules/user/dtos/create-user.dto";

export function ApiResponseAndBodyForCreateUser() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiResponse({ status: 201, description: 'The record has been successfully created.' })(target, key, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(target, key, descriptor);
    ApiBody({ type: CreateUserDto, description: 'Json structure for user object' })(target, key, descriptor);
  }
}
// Trong ví dụ trên, @ApiResponse được sử dụng để đánh dấu các phản hồi mà endpoint có thể trả về. Trong trường hợp này, chúng ta đánh dấu hai phản hồi: một cho trường hợp thành công (status code 201) và một cho trường hợp bị cấm (status code 403).
// @ApiBody được sử dụng để xác định cấu trúc dữ liệu của body được gửi đến trong request.Trong ví dụ này, chúng ta đánh dấu rằng body của request cần phải tuân theo cấu trúc được định nghĩa trong CreateUserDto.
// Những decorator này sẽ được Swagger sử dụng để tự động tạo ra tài liệu API dựa trên các thông tin mà chúng cung cấp.
export function ApiResponseCreate() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiResponse({ status: 201, description: 'The record has been successfully created.' })(target, key, descriptor);
    ApiResponse({ status: 403, description: 'Forbidden.' })(target, key, descriptor);
  }
}