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
        private readonly candidateRepository: Repository<Candidate>,
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

}
