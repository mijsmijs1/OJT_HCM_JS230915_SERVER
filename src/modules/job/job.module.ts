import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '../candidate/database/candidate.entity';
import { Job } from './database/job.entity';
import { LevelJob } from './database/levelJob.entity';
import { TypeJob } from './database/typeJob.entity';
import { AuthService } from '../auth/auth.service';
import { RedisService } from 'src/shared/utils/redis/redis';
import { AuthenticateJWTMiddleware } from 'src/shared/middleware/authen-jwr.middleware';
import { Account_Company } from '../company/database/account_company.entity';
import { Location } from '../company/database/location.entity';
import { Jobs_Candidates } from './database/jobs_candidates.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate, Job, LevelJob, TypeJob, Account_Company, Location, Jobs_Candidates])],
  controllers: [JobController],
  providers: [JobService, AuthService, RedisService]
})
export class JobModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateJWTMiddleware)
      .forRoutes(
        { path: "job/create-job", method: RequestMethod.POST, version: '1' },
        { path: "job/update-job/:jobId", method: RequestMethod.PATCH, version: '1' }
      )
  }
}


