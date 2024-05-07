import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { AuthenticateJWTMiddleware } from 'src/shared/middleware/authen-jwr.middleware';
import { AuthService } from '../auth/auth.service';
import { RedisService } from 'src/shared/utils/redis/redis';
import { MailService } from 'src/shared/utils/mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './database/candidate.entity';

import { CertificateCandidate } from './database/certificate_candidate.entity';
import { EducationCandidate } from './database/education_candidate.entity';
import { ExperienceCandidate } from './database/experience_candidate.entity';
import { ProjectCandidate } from './database/project_candidate.entity';
import { SkillsCandidate } from './database/skill_candidate.entity';
import { Account_Company } from '../company/database/account_company.entity';
import { Jobs_Candidates } from '../job/database/jobs_candidates.entity';
import { Job } from '../job/database/job.entity';
import { Company } from '../company/database/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Candidate, Job, CertificateCandidate, EducationCandidate, ExperienceCandidate, ProjectCandidate, SkillsCandidate, Account_Company, Jobs_Candidates])],
  controllers: [CandidateController],
  providers: [CandidateService, RedisService, MailService, AuthService],
})
export class CandidateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateJWTMiddleware)
      .forRoutes(
        { path: "candidate/create-certificate", method: RequestMethod.POST, version: '1' },
        { path: "candidate/create-education", method: RequestMethod.POST, version: '1' },
        { path: "candidate/create-experience", method: RequestMethod.POST, version: '1' },
        { path: "candidate/create-project", method: RequestMethod.POST, version: '1' },
        { path: "candidate/create-skill", method: RequestMethod.POST, version: '1' },
        { path: "candidate/create-job-application", method: RequestMethod.POST, version: '1' },
        { path: "candidate/update-certificate/:id", method: RequestMethod.PATCH, version: '1' },
        { path: "candidate/update-education/:id", method: RequestMethod.PATCH, version: '1' },
        { path: "candidate/update-experience/:id", method: RequestMethod.PATCH, version: '1' },
        { path: "candidate/update-project/:id", method: RequestMethod.PATCH, version: '1' },
        { path: "candidate/update-skill/:id", method: RequestMethod.PATCH, version: '1' },
        { path: "candidate/get-applied-job", method: RequestMethod.GET, version: '1' },
        { path: "candidate/get-candidate-by-id/:candidateId", method: RequestMethod.GET, version: '1' },
        { path: "candidate/get-applied-candidate/:jobId/get", method: RequestMethod.GET, version: '1' },
        { path: "candidate/get-CV", method: RequestMethod.GET, version: '1' },
        { path: "candidate/skill", method: RequestMethod.GET, version: '1' },
        { path: "candidate/certificate", method: RequestMethod.GET, version: '1' },
        { path: "candidate/education", method: RequestMethod.GET, version: '1' },
        { path: "candidate/experience", method: RequestMethod.GET, version: '1' },
        { path: "candidate/project", method: RequestMethod.GET, version: '1' },
        { path: "candidate/delete-education/:id", method: RequestMethod.DELETE, version: '1' },
      )
  }
}