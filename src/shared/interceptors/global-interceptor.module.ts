import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ResponseTransformInterceptor } from './response.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
  ],
})
export class GlobalInterceptorModule { }
//Đoạn mã trên định nghĩa một module trong NestJS có tên là GlobalInterceptorModule. Module này có một interceptor được đăng ký làm global interceptor, có nghĩa là nó sẽ áp dụng cho tất cả các request được gửi đến ứng dụng Nest.

// @Module({}): Decorator @Module() được sử dụng để định nghĩa một module trong NestJS.
//   providers: Thuộc tính này xác định danh sách các provider mà module này cung cấp.Trong trường hợp này, module cung cấp một provider là một interceptor.
//     provide: APP_INTERCEPTOR: Đây là một hằng số được cung cấp sẵn bởi NestJS, được sử dụng để chỉ ra rằng provider đang được cung cấp là một global interceptor.
//       useClass: ResponseTransformInterceptor: Xác định rằng interceptor được sử dụng là ResponseTransformInterceptor, một class được định nghĩa trong cùng thư mục với module này.
// Với cấu hình như trên, ResponseTransformInterceptor sẽ được áp dụng cho mọi request gửi đến ứng dụng Nest, cho phép biến đổi và xử lý các phản hồi trước khi chúng được trả về cho client.