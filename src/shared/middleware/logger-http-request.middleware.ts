import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

function httpRequestLoggerBuilder(req: Request): string {
  const param = `\n param: ${JSON.stringify(req.params)}`;
  const query = `\n query: ${JSON.stringify(req.query)}`;
  const body =
    req.method === 'POST' || req.method === 'PUT'
      ? `\n body: ${JSON.stringify(req.body)}`
      : '';
  const logger = `[${req.method} - ${req.baseUrl}]: ${param} ${query} ${body}`;
  return logger;
}

@Injectable()
export class LoggerHttpRequestMiddleware implements NestMiddleware { //Middleware này được sử dụng để ghi log các yêu cầu HTTP đến ứng dụng Nest.
  private readonly logger = new Logger(LoggerHttpRequestMiddleware.name); //private readonly logger = new Logger(LoggerHttpRequestMiddleware.name): Tạo một instance của Logger với tên là tên của class LoggerHttpRequestMiddleware. Điều này giúp phân biệt log của middleware này với các log khác trong ứng dụng.

  use(req: Request, res: Response, next: NextFunction) { //use(req: Request, res: Response, next: NextFunction) { ... }: Phương thức use() là một phương thức bắt buộc phải được triển khai khi implement interface NestMiddleware. Nó nhận vào ba tham số: req là yêu cầu HTTP, res là phản hồi HTTP, và next là một hàm callback để chuyển quyền kiểm soát sang middleware tiếp theo trong chuỗi middleware.
    this.logger.log(httpRequestLoggerBuilder(req)); //this.logger.log(httpRequestLoggerBuilder(req)): Ghi log sử dụng instance của Logger đã được khởi tạo. httpRequestLoggerBuilder(req) là một hàm được gọi để xây dựng thông tin log từ yêu cầu HTTP.
    next();
  }
}//Cách các log được lưu và hiển thị phụ thuộc vào cấu hình của ứng dụng NestJS. Thông thường, các log được gửi đến một hoặc nhiều nguồn như console, file log, hoặc các dịch vụ quản lý log như ELK Stack (Elasticsearch, Logstash, Kibana) hoặc Splunk.
