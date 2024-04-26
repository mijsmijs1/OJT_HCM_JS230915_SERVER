import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../admin/database/admin.entity';
import { ApplicationController } from './application.controller';
import { MailService } from 'src/shared/utils/mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../application/database/application.entity';
import { AdminJWTMiddleware } from 'src/shared/middleware/admin-jwr.middleware';
import { RedisService } from 'src/shared/utils/redis/redis';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Application, Admin])],
  controllers: [ApplicationController],
  providers: [ApplicationService, MailService, RedisService, AdminService],
})

export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminJWTMiddleware)
      .forRoutes(
        { path: "application/create-application", method: RequestMethod.POST, version: '1' },
        { path: "application/update-application/:id", method: RequestMethod.PATCH, version: '1' },
        { path: "application/remove/:id", method: RequestMethod.DELETE, version: '1' },

      )
  }
}
