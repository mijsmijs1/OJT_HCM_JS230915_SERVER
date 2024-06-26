import { Module, OnModuleInit } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { MulterModule } from '@nestjs/platform-express';
import { CompanyModule } from './modules/company/company.module';
import { JobModule } from './modules/job/job.module';
import { CandidateModule } from './modules/candidate/candidate.module';
import { AuthModule } from './modules/auth/auth.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import { RedisService } from './shared/utils/redis/redis';
import { MailService } from './shared/utils/mail/mail.service';
import { AuthService } from './modules/auth/auth.service';
import { Candidate } from './modules/candidate/database/candidate.entity';
import { CertificateCandidate } from './modules/candidate/database/certificate_candidate.entity';
import { EducationCandidate } from './modules/candidate/database/education_candidate.entity';
import { ExperienceCandidate } from './modules/candidate/database/experience_candidate.entity';
import { ProjectCandidate } from './modules/candidate/database/project_candidate.entity';
import { SkillsCandidate } from './modules/candidate/database/skill_candidate.entity';
import { Account_Company } from './modules/company/database/account_company.entity';
import { Company } from './modules/company/database/company.entity';
import { Jobs_Candidates } from './modules/job/database/jobs_candidates.entity';
import { DefaultEntriesService } from './shared/seeds/seed';
import { TypeJob } from './modules/job/database/typeJob.entity';
import { Repository } from 'typeorm';
import { LevelJob } from './modules/job/database/levelJob.entity';
import { Type_Company } from './modules/company/database/type_company.entity';
import { CompanyService } from './modules/company/company.service';
import { Address_Company } from './modules/company/database/address_company.entity';
import { Location } from './modules/company/database/location.entity';
import { JobService } from './modules/job/job.service';
import { Job } from './modules/job/database/job.entity';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...config
      })
    }),
    TypeOrmModule.forFeature([Candidate, CertificateCandidate, EducationCandidate, ExperienceCandidate, ProjectCandidate, SkillsCandidate, Account_Company, Company, Jobs_Candidates, TypeJob, LevelJob, Type_Company, Address_Company, Location, Job]),
    MulterModule.register({
      dest: './uploads', // Đường dẫn tới thư mục lưu trữ file tải lên
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '../i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang', 'language']),
      ]
    }),
    UserModule,
    CompanyModule,
    JobModule,
    CandidateModule,
    AuthModule,
  ],
  controllers: [],
  providers: [RedisService, MailService, AuthService, DefaultEntriesService, CompanyService, JobService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly defaultEntriesService: DefaultEntriesService,
  ) { }
  async onModuleInit() {
    try {
      await this.defaultEntriesService.createDefaultTypeJob();
      await this.defaultEntriesService.createDefaultLevelJob();
      await this.defaultEntriesService.createDefaultTypeCompany();
      await this.defaultEntriesService.createDefaultCompanyAccount();
    } catch (err) {
      console.log(err)
    }
  }
}
