import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from './database/candidate.entity';
import { Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CertificateCandidate } from './database/certificate_candidate.entity';
import { EducationCandidate } from './database/education_candidate.entity';
import { ExperienceCandidate } from './database/experience_candidate.entity';
import { ProjectCandidate } from './database/project_candidate.entity';
import { SkillsCandidate } from './database/skill_candidate.entity';
import { Jobs_Candidates } from '../job/database/jobs_candidates.entity';
import { Job } from '../job/database/job.entity';
import { Company } from '../company/database/company.entity';

@Global()
@Injectable()
export class CandidateService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        @InjectRepository(Candidate)
        private readonly candidateRepository: Repository<Candidate>,
        @InjectRepository(Jobs_Candidates)
        private readonly jobCandidateRepository: Repository<Jobs_Candidates>,
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
        @InjectRepository(CertificateCandidate)
        private readonly certificateCandidateRepository: Repository<CertificateCandidate>,
        @InjectRepository(EducationCandidate)
        private readonly educationCandidateRepository: Repository<EducationCandidate>,
        @InjectRepository(ExperienceCandidate)
        private readonly experienceCandidateRepository: Repository<ExperienceCandidate>,
        @InjectRepository(ProjectCandidate)
        private readonly projectCandidateRepository: Repository<ProjectCandidate>,
        @InjectRepository(SkillsCandidate)
        private readonly skillCandidateRepository: Repository<SkillsCandidate>,
        private readonly i18n: I18nService
    ) { }

    async createJobApplication(createData: any) {
        try {
            const newItem = await this.jobCandidateRepository.create({
                ...createData,
                job: { id: createData.job_id }, // Thiết lập job_id
                candidate: { id: createData.candidate_id }, // Thiết lập candidate_id
            })
            await this.jobCandidateRepository.save(newItem)
            let candidate = await this.candidateRepository.findOne({
                where: { id: createData.candidate_id },
                relations: ['jobs']
            })
            let job = await this.jobRepository.findOne({
                where: { id: createData.job_id },
                relations: ['candidates']
            })
            job.candidates.push(candidate)
            await this.jobRepository.save(job)
            candidate.jobs.push(job)
            await this.candidateRepository.save(candidate)
            return newItem
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async getAppliedJob(candidateId: number, page: number, pageSize: number) {
        try {
            let skip = 0;
            if (page > 1) {
                skip = (page - 1) * pageSize;
            }
            const jobs = await this.jobRepository.createQueryBuilder("job")
                .innerJoin("job.candidates", "candidate", "candidate.id = :candidateId", { candidateId })
                .leftJoinAndSelect("job.location", "location")
                .leftJoinAndSelect("job.typeJobs", "typeJobs")
                .leftJoinAndSelect("job.levelJob", "levelJob")
                .select(['job.id', 'job.created_at', 'job.updated_at', 'job.company_id', 'job.expire_at', 'job.title', 'job.salary', 'location', 'levelJob', 'typeJobs'])
                .orderBy("job.updated_at", "DESC")
                .skip(skip)
                .take(pageSize)
                .getMany();

            const jobsCount = await this.jobRepository.createQueryBuilder("job")
                .innerJoin("job.candidates", "candidate", "candidate.id = :candidateId", { candidateId })
                .select(['job.id'])
                .getMany();
            for (let item of jobs) {
                const company = await this.companyRepository.findOne({
                    where: { id: item.company_id },
                    relations: ['type_company'],
                    select: ['id', 'logo', 'name'] // Thêm các quan hệ mà bạn muốn load
                });
                item.company = company;
            }

            return { jobs, count: jobsCount.length };
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }
    async getAppliedCandidate(jobId: number, page: number, pageSize: number) {

        try {
            let skip = 0;
            if (page > 1) {
                skip = (page - 1) * pageSize;
            }
            const candidates = await this.candidateRepository.createQueryBuilder("candidate")
                .innerJoin("candidate.jobs", "job", "job.id = :jobId", { jobId })
                .leftJoinAndSelect("candidate.certificates", "certificates")
                .leftJoinAndSelect("candidate.education", "education")
                .leftJoinAndSelect("candidate.skills", "skills")
                .select(['candidate.id', 'candidate.name', 'candidate.address', 'candidate.created_at', 'candidate.updated_at', 'education', 'skills', 'certificates'])
                .orderBy("candidate.updated_at", "ASC")
                .skip(skip)
                .take(pageSize)
                .getMany();

            const candidatesCount = await this.candidateRepository.createQueryBuilder("candidate")
                .innerJoin("candidate.jobs", "job", "job.id = :jobId", { jobId })
                .getCount();

            // for (let item of candidates) {
            //     const company = await this.companyRepository.findOne({
            //         where: { id: item.company_id },
            //         relations: ['type_company'],
            //         select: ['id', 'logo', 'name'] // Thêm các quan hệ mà bạn muốn load
            //     });
            //     item.company = company;
            // }

            return { candidates, count: candidatesCount };
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async getCV(candidateId: number, jobId: number) {
        try {
            let CV = await this.jobCandidateRepository.findOne({
                where: {
                    candidate: { id: candidateId },
                    job: { id: jobId }
                }
            });
            if (!CV) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return CV;

        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }

    async getById(candidateId: number) {
        try {
            let candidate = await this.candidateRepository.findOne({
                where: { id: candidateId },
                relations: ['education', 'experience', 'projects', 'certificates', 'skills', 'jobs']
            });
            if (!candidate) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return candidate;

        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }

    async createCertificate(createData: any) {
        try {
            const newItem = await this.certificateCandidateRepository.create({ ...createData })
            await this.certificateCandidateRepository.save(newItem)
            return newItem
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async createEducation(createData: any) {
        try {
            const newItem = await this.educationCandidateRepository.create({ ...createData })
            await this.educationCandidateRepository.save(newItem)
            return newItem
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async createExperience(createData: any) {
        try {
            const newItem = await this.experienceCandidateRepository.create({ ...createData })
            await this.experienceCandidateRepository.save(newItem)
            return newItem
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async createProject(createData: any) {
        try {
            const newItem = await this.projectCandidateRepository.create({ ...createData })
            await this.projectCandidateRepository.save(newItem)
            return newItem
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async createSkill(createData: any) {
        try {
            const newItem = await this.skillCandidateRepository.create({ ...createData })
            await this.skillCandidateRepository.save(newItem)
            return newItem
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async updateCertificate(id: number, updateData: any) {
        try {
            await this.certificateCandidateRepository.update(id, { ...updateData, updated_at: new Date() })
            const updatedItem = await this.certificateCandidateRepository.findOneBy({ id });
            return updatedItem
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async updateEducation(id: number, updateData: any) {
        try {
            await this.educationCandidateRepository.update(id, { ...updateData, updated_at: new Date() });
            const updatedItem = await this.educationCandidateRepository.findOneBy({ id });
            return updatedItem;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async updateExperience(id: number, updateData: any) {
        try {
            await this.experienceCandidateRepository.update(id, { ...updateData, updated_at: new Date() });
            const updatedItem = await this.experienceCandidateRepository.findOneBy({ id });
            return updatedItem;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async updateProject(id: number, updateData: any) {
        try {
            await this.projectCandidateRepository.update(id, { ...updateData, updated_at: new Date() });
            const updatedItem = await this.projectCandidateRepository.findOneBy({ id });
            return updatedItem;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async updateSkill(id: number, updateData: any) {
        try {
            await this.skillCandidateRepository.update(id, { ...updateData, updated_at: new Date() });
            const updatedItem = await this.skillCandidateRepository.findOneBy({ id });
            return updatedItem;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }
    async getSkill() {
        try {
            let data = await this.skillCandidateRepository.find()
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async getCertificate() {
        try {
            let data = await this.certificateCandidateRepository.find()
            return data;
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async getEducation() {
        try {
            let data = await this.educationCandidateRepository.find()
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async getExperience() {
        try {
            let data = await this.experienceCandidateRepository.find()
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async getProject() {
        try {
            let data = await this.projectCandidateRepository.find()
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async getSkillById(id: number) {
        try {
            let data = await this.skillCandidateRepository.find({ where: { candidate_id: id } })
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async getCertificateById(id: number) {
        try {
            let data = await this.certificateCandidateRepository.find({ where: { candidate_id: id } })
            return data;
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async getEducationById(id: number) {
        try {
            let data = await this.educationCandidateRepository.find({ where: { candidate_id: id } })
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async getExperienceById(id: number) {
        try {
            let data = await this.experienceCandidateRepository.find({ where: { candidate_id: id } })
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async getProjectById(id: number) {
        try {
            let data = await this.projectCandidateRepository.find({ where: { candidate_id: id } })
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async findCertificateByIdFromAccountId(accountId: number, id: number) {
        try {
            let item = await this.certificateCandidateRepository.findOneBy({ id: id, candidate_id: accountId })
            if (!item) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return item;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }

    async findExperienceByIdFromAccountId(accountId: number, id: number) {
        try {
            let item = await this.experienceCandidateRepository.findOneBy({ id: id, candidate_id: accountId })
            if (!item) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return item;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }

    async findEducationByIdFromAccountId(accountId: number, id: number) {
        try {
            let item = await this.educationCandidateRepository.findOneBy({ id: id, candidate_id: accountId })
            if (!item) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return item;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }

    async findProjectByIdFromAccountId(accountId: number, id: number) {
        try {
            let item = await this.projectCandidateRepository.findOneBy({ id: id, candidate_id: accountId })
            if (!item) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return item;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }

    async findSkillByIdFromAccountId(accountId: number, id: number) {
        try {
            let item = await this.skillCandidateRepository.findOneBy({ id: id, candidate_id: accountId })
            if (!item) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return item;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }

    async deleteEducation(id: number) {
        try {
            await this.educationCandidateRepository.delete(id);
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }
}
