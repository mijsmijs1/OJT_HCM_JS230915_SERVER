import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

class ResponseSuccess {
  public readonly message: string = 'Success';
  public readonly success: boolean = true;
  public total: number;
  public data: any;
  public currentPage: number;

  constructor(data: any, total: number, currentPage?: number) {
    if (!data) {
      return;
    }
    if (data && typeof data === 'object' && data.data) {
      this.data = data.data;
    } else {
      this.data = data;
    }
    if (total !== undefined && total !== null) {
      delete data.total;
      this.total = total;
    }
    if (currentPage !== undefined && currentPage !== null) {
      delete data.currentPage;
      this.currentPage = currentPage;
    }
  }
}
// Đây là 1 Interceptor để bảo đảm cho dữ liệu đi qua được validate, và sẽ trả về 1 instance của class để chấm dữ liệu ra, nếu dữ liệu sai sẽ trả về sai không chấm được
@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor { //Đây là một interceptor trong NestJS, một loại middleware được sử dụng để thực hiện các logic xử lý trước hoặc sau khi một request được xử lý. Interceptor này được triển khai từ NestInterceptor interface.
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> { //Đây là phương thức được triển khai từ NestInterceptor interface. Phương thức này được gọi mỗi khi một request được gửi đến server. context: Đối tượng ExecutionContext cung cấp thông tin về ngữ cảnh của request hiện tại, bao gồm request, response và các thông tin khác.next: Đối tượng CallHandler đại diện cho phần tiếp theo của chuỗi xử lý request, ví dụ như một controller handler.
    return next
      .handle() //Khi một interceptor được gọi, next.handle() sẽ gửi request đến phần xử lý tiếp theo trong chuỗi middleware. Phần này có thể là một controller handler hoặc một interceptor khác (nếu có).
      .pipe( //Trong phương thức intercept, chúng ta sử dụng phương thức pipe để xử lý dữ liệu trả về từ next.handle(). Phương thức này được sử dụng để ánh xạ dữ liệu trả về từ dạng Observable của next.handle() sang dạng khác.
        map(data => new ResponseSuccess(data, data?.total, data?.currentPage)),
      );  // Cuối cùng, interceptor này trả về một Observable chứa kết quả của việc ánh xạ dữ liệu. Kết quả này chứa dữ liệu đã được biến đổi và sẵn sàng được truyền đến phần xử lý tiếp theo của request.
  }
}
//Trong NestJS, Observable là một kiểu dữ liệu được sử dụng để xử lý các dòng dữ liệu không đồng bộ. Nó được sử dụng rộng rãi trong các tác vụ như xử lý HTTP requests, thao tác với cơ sở dữ liệu, và làm việc với các sự kiện trong ứng dụng.

// Observable là một phần của thư viện RxJS (Reactive Extensions for JavaScript), một thư viện mạnh mẽ cho việc lập trình bất đồng bộ trong JavaScript và TypeScript. Nó cung cấp một cách linh hoạt và mạnh mẽ để làm việc với dữ liệu dạng stream, cho phép bạn thực hiện các thao tác như ánh xạ, lọc, ghép nối, và xử lý lỗi dễ dàng.

// Trong NestJS, Observable được sử dụng chủ yếu trong các context như các HTTP requests, WebSockets, và các sự kiện khác. Bằng cách sử dụng Observable, bạn có thể xử lý dữ liệu theo cách linh hoạt và hiệu quả, đồng thời giữ mã của bạn dễ đọc và dễ bảo trì.