import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { MulterModule } from '@nestjs/platform-express';
import { CompanyModule } from './modules/company/company.module';
import { JobModule } from './modules/job/job.module';
import { CandidateModule } from './modules/candidate/candidate.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    MulterModule.register({
      dest: './uploads', // Đường dẫn tới thư mục lưu trữ file tải lên
    }),
    UserModule,
    CompanyModule,
    JobModule,
    CandidateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
