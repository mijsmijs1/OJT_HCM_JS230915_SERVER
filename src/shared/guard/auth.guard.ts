// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { Role } from 'src/constant/enum';

interface DecodedToken {
  role: string; // Định nghĩa kiểu cho thuộc tính role
}

@Injectable()
export class RoleGuard implements CanActivate { //Đây là một interface trong NestJS được sử dụng để tạo ra các guard. Guard là một loại middleware trong NestJS được sử dụng để kiểm tra xem một request có được chấp nhận hoặc không trước khi nó đến tay handler của route. CanActivate là một trong các interfaces mà một guard class cần implement.
  constructor(private reflector: Reflector) { }
  // Trong đoạn mã trên, Reflector được sử dụng để truy cập metadata của các thành phần trong NestJS. Trong ngữ cảnh của RoleGuard, Reflector được sử dụng để truy cập metadata của các decorator được áp dụng cho route hoặc handler mà guard này được gắn vào.

  // Metadata là các thông tin được gắn liền với các thành phần của ứng dụng trong quá trình khai thác và xử lý. Trong trường hợp của RoleGuard, Reflector giúp guard này truy cập các decorator áp dụng cho route hoặc handler, chẳng hạn như decorator để xác định vai trò của người dùng (@Roles) hoặc decorator để xác định quyền truy cập (@Permissions).

  // Khi có quyền truy cập vào metadata, RoleGuard có thể kiểm tra và xác định xem request có được chấp nhận hay không dựa trên vai trò hoặc quyền truy cập của người dùng.
  canActivate(
    context: ExecutionContext, //Đây là một interface trong NestJS biểu diễn ngữ cảnh thực thi của một request. Nó chứa thông tin về request, response, và context của ứng dụng trong quá trình xử lý request.
  ): boolean | Promise<boolean> | Observable<boolean> { //Đây là một kiểu dữ liệu trong RxJS, một thư viện được sử dụng trong NestJS cho việc lập trình bất đồng bộ. Observable được sử dụng để xử lý các sự kiện hoặc dữ liệu có thể được phát ra theo thời gian trong ứng dụng.
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken; // Ép kiểu cho decoded
      request.user = decoded;
      const check = (+decoded.role === Role.candidate) || (+decoded.role === Role.company) ? true : false;
      return check
      // return roles.includes(decoded.role);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
