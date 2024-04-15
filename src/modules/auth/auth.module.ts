import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '../candidate/database/candidate .entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Candidate])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
