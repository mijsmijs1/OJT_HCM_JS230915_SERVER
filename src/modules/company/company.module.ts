import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './database/company.entity';
import { Account_Company } from './database/account_company.entity';
import { Candidate } from '../candidate/database/candidate.entity';
import { AuthenticateJWTMiddleware } from 'src/shared/middleware/authen-jwr.middleware';
import { RedisService } from 'src/shared/utils/redis/redis';
import { Type_Company } from './database/type_company.entity';
import { Address_Company } from './database/address_company.entity';
import { Location } from './database/location.entity';
import { Jobs_Candidates } from '../job/database/jobs_candidates.entity';
import { MailService } from 'src/shared/utils/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate, Company, Account_Company, Type_Company, Address_Company, Location, Jobs_Candidates])],
  controllers: [CompanyController],
  providers: [CompanyService, AuthService, RedisService, MailService]
})
export class CompanyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateJWTMiddleware)
      .forRoutes(
        { path: "company/create-company", method: RequestMethod.POST, version: '1' },
        { path: "company/create-address/:companyId", method: RequestMethod.POST, version: '1' },
        // { path: "company/search", method: RequestMethod.GET, version: '1' },
        // { path: "company/:companyId", method: RequestMethod.GET, version: '1' },
        { path: "company/update-company/:companyId", method: RequestMethod.PATCH, version: '1' },
        { path: "company/update-address", method: RequestMethod.PATCH, version: '1' },
        { path: "company/active-account-company", method: RequestMethod.GET, version: '1' }
      )
  }
}