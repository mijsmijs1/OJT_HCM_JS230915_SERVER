import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { httpInternalServerErrorException } from '../exceptions/http-exception';

interface IClassType<T> {  //IClassType<T> là một interface generic, nó có một tham số type là T. new(): T; là một phương thức trong interface, nó được sử dụng để tạo ra một instance mới của kiểu T. Trong TypeScript, T là một biến type được sử dụng để biểu diễn một kiểu dữ liệu tùy ý. Khi bạn sử dụng Generics, bạn có thể truyền một kiểu dữ liệu cụ thể cho T khi sử dụng interface hoặc class có sử dụng Generics.
  new(): T;
}
//Interceptor này được sử dụng để chuyển đổi dữ liệu từ dạng plain object thành instance của một class cụ thể và thực hiện validation trên dữ liệu đó bằng cách sử dụng class-validator. Dưới đây là các bước hoạt động của interceptor:
@Injectable()
export class PlainToClassTransformInterceptor<T>  //T được sử dụng như một generic type parameter của class PlainToClassTransformInterceptor, cho phép bạn truyền một kiểu dữ liệu tùy ý khi sử dụng interceptor này.
  implements NestInterceptor<Partial<T>, T> {  //implements NestInterceptor<Partial<T>, T> cho biết rằng class PlainToClassTransformInterceptor sẽ implement interface NestInterceptor, trong đó kiểu dữ liệu của observable là Partial<T> (một phần của kiểu T) và kiểu dữ liệu của giá trị trả về là T.
  constructor(private readonly classType: IClassType<T>) { }  //Constructor của class nhận một tham số classType có kiểu dữ liệu là IClassType<T>, cho phép bạn truyền một loại class cụ thể cho Generics T khi tạo một instance của class PlainToClassTransformInterceptor.

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map(data => plainToClass(this.classType, data)),  // Chuyển đổi dữ liệu từ dạng plain object thành instance của một class được chỉ định bằng cách sử dụng hàm plainToClass từ thư viện class-transformer.
      map(data =>
        from(validate(data as Object)).pipe( //Thực hiện validation trên dữ liệu đã được chuyển đổi thành class instance, bằng cách sử dụng hàm validate từ thư viện class-validator. Nếu có lỗi validation, một exception sẽ được throw.
          map(error => {
            console.log(error);
            if (error.length > 0) {
              httpInternalServerErrorException();
            }
            return data;
          }),
        ),
      ),
      mergeMap(data => data), //Merge dữ liệu từ observable vào chuỗi stream chính, để trả về dữ liệu đã qua xử lý từ interceptor.
    );
  }
}
