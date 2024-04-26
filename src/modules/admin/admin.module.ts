import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './database/admin.entity';
import { MailService } from 'src/shared/utils/mail/mail.service';
import { RedisService } from 'src/shared/utils/redis/redis';
import { AdminJWTMiddleware } from 'src/shared/middleware/admin-jwr.middleware';
import { Application } from '../application/database/application.entity';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Admin, Application])],
  controllers: [AdminController],
  providers: [AdminService, MailService, RedisService, AdminJWTMiddleware],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminJWTMiddleware)
      .forRoutes(
        { path: "admin/logout", method: RequestMethod.GET, version: '1' },
        { path: "admin/check-token", method: RequestMethod.GET, version: '1' },
      )
  }
}
