import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '../candidate/database/candidate.entity';
import { Company } from '../company/database/company.entity';
import { Account_Company } from '../company/database/account_company.entity';
import { AuthenticateJWTMiddleware } from 'src/shared/middleware/authen-jwr.middleware';
import { RedisService } from 'src/shared/utils/redis/redis';
import { MailService } from 'src/shared/utils/mail/mail.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Candidate, Company, Account_Company])],
  controllers: [AuthController],
  providers: [AuthService, RedisService, MailService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateJWTMiddleware)
      .forRoutes(
        { path: "auth/logout", method: RequestMethod.GET, version: '1' },
        { path: "auth/check-token", method: RequestMethod.GET, version: '1' },
        { path: "auth/send-new-password", method: RequestMethod.GET, version: '1' },
        { path: "auth/change-password", method: RequestMethod.POST, version: '1' },
      )
  }
}
