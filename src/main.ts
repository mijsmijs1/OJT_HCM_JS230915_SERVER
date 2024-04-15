import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {  HttpStatus, VersioningType } from '@nestjs/common';
import { useContainer } from 'typeorm';
import { SwaggerModule } from '@nestjs/swagger';
import config from './config/swagger-config';
import * as basicAuth from "express-basic-auth";

// Import firebase
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { ServiceAccount } from 'firebase-admin';
import { I18nMiddleware, I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const PORT = process.env.PORT || 8080;
  const app = await NestFactory.create(AppModule);
  // app.use(formidable())  ;
  // app.use(multer().none());
  app.enableCors();
  // app.useGlobalPipes(new ValidationPipe());
  app.use(I18nMiddleware);
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    })
  );
  app.use(
    // Paths you want to protect with basic auth (bao ve swagger) (bảo vệ đường link /docs Những người dùng cố gắng truy cập các tài nguyên được bảo vệ sẽ cần cung cấp tên người dùng và mật khẩu đã được chỉ định để tiếp tục. )
    "/docs*",
    basicAuth({
      challenge: true,
      users: {
        yourUserName: "p4ssw0rd",
      },
    })
  );

  // Kêt nối firebase

  // const configService: ConfigService = app.get(ConfigService);
  //   // Set the config options
  //   const adminConfig: ServiceAccount = {
  //     "projectId": process.env.FIREBASE_PROJECT_ID,
  //     "privateKey": process.env.FIREBASE_PRIVATE_KEY,
  //     "clientEmail":process.env.FIREBASE_CLIENT_EMAIL,
  //   };
  //   // Initialize the firebase admin app
  //   admin.initializeApp({
  //     credential: admin.credential.cert(adminConfig),
  //     databaseURL: "https://nestjs-fierebase-default-rtdb.firebaseio.com/",
  //   }); 
  // Sử dụng middleware express-formidable

  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); //useGlobalInterceptors được sử dụng để đăng ký interceptor toàn cầu ClassSerializerInterceptor, giúp chuyển đổi các đối tượng trả về thành đối tượng JSON và loại bỏ các trường không cần thiết.
  useContainer(app.select(AppModule), { fallbackOnErrors: true }); //useContainer được sử dụng để cấu hình container dependency injection cho AppModule, module gốc của ứng dụng, và fallbackOnErrors được đặt thành true để ứng dụng tiếp tục chạy nếu có lỗi xảy ra trong quá trình cấu hình container.

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      security: [{ 'bearer': [] }],
    },
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"]
  }
  )
  await app.listen(PORT, () => {
    console.log(`App listen on port: http://localhost:${PORT}`);
    console.log(`Swagger-UI listen on: http://localhost:${PORT}/api-docs`);
  });
}
bootstrap();
