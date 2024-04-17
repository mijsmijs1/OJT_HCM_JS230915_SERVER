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

@Global()
@Injectable()
export class CandidateService {
    constructor(
        @InjectRepository(Candidate)
        private readonly candidateRespository: Repository<Candidate>,
        @InjectRepository(CertificateCandidate)
        private readonly certificateCandidateRespository: Repository<CertificateCandidate>,
        @InjectRepository(EducationCandidate)
        private readonly educationCandidateRespository: Repository<EducationCandidate>,
        @InjectRepository(ExperienceCandidate)
        private readonly experienceCandidateRespository: Repository<ExperienceCandidate>,
        @InjectRepository(ProjectCandidate)
        private readonly projectCandidateRespository: Repository<ProjectCandidate>,
        @InjectRepository(SkillsCandidate)
        private readonly skillCandidateRespository: Repository<SkillsCandidate>,
        private readonly i18n: I18nService
    ) { }
    async createCertificate(createData: any) {
        try {
            const newItem = await this.certificateCandidateRespository.create({ ...createData })
            await this.certificateCandidateRespository.save(newItem)
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
            const newItem = await this.educationCandidateRespository.create({ ...createData })
            await this.educationCandidateRespository.save(newItem)
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
            const newItem = await this.experienceCandidateRespository.create({ ...createData })
            await this.experienceCandidateRespository.save(newItem)
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
            const newItem = await this.projectCandidateRespository.create({ ...createData })
            await this.projectCandidateRespository.save(newItem)
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
            const newItem = await this.skillCandidateRespository.create({ ...createData })
            await this.skillCandidateRespository.save(newItem)
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
            await this.certificateCandidateRespository.update(id, { ...updateData, updated_at: new Date() })
            const updatedItem = await this.certificateCandidateRespository.findOneBy({ id });
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
            await this.educationCandidateRespository.update(id, { ...updateData, updated_at: new Date() });
            const updatedItem = await this.educationCandidateRespository.findOneBy({ id });
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
            await this.experienceCandidateRespository.update(id, { ...updateData, updated_at: new Date() });
            const updatedItem = await this.experienceCandidateRespository.findOneBy({ id });
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
            await this.projectCandidateRespository.update(id, { ...updateData, updated_at: new Date() });
            const updatedItem = await this.projectCandidateRespository.findOneBy({ id });
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
            await this.skillCandidateRespository.update(id, { ...updateData, updated_at: new Date() });
            const updatedItem = await this.skillCandidateRespository.findOneBy({ id });
            return updatedItem;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

}
