import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '../candidate/database/candidate .entity';
import { Company } from '../company/database/company.entity';
import { Account_Company } from '../company/database/account_company.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Candidate, Company, Account_Company])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
