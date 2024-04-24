import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '../candidate/database/candidate.entity';
import { Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { RegisterAuthDTO } from './dtos/register-auth.dto';
import { CandidateGender, Role } from 'src/constant/enum';
import { Account_Company } from '../company/database/account_company.entity';
import { SecureUtils } from 'src/shared/utils/secure.util';
import { Jobs_Candidates } from '../job/database/jobs_candidates.entity';


@Global()
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Candidate)
        private readonly candidateRepository: Repository<Candidate>,
        @InjectRepository(Jobs_Candidates)
        private readonly jobCandidateRepository: Repository<Jobs_Candidates>,
        @InjectRepository(Account_Company)
        private readonly accountCompanyRepository: Repository<Account_Company>,
        private readonly i18n: I18nService
    ) { }

    async create(registerData: RegisterAuthDTO): Promise<Candidate | undefined> {

        try {
            const existingEmail = await this.findByEmailForResgister(registerData.email, 'all')
            if (existingEmail) {
                throw new HttpException(this.i18n.t('err-message.errors.existingRegisterInfo', { lang: I18nContext.current().lang }), HttpStatus.CONFLICT, { cause: "Conflict" })
            }
            const password = await SecureUtils.hashPassword(registerData.password) as string
            const newCandidate = await this.candidateRepository.create({ ...registerData, password })
            await this.candidateRepository.save(newCandidate)
            return newCandidate
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async update(id: number, updateData: any, role: string) {
        try {
            if (Role[role] == Role.candidate) {
                const updatedCandidate = await this.candidateRepository.update(id, { ...updateData, updated_at: new Date() })
                if (updatedCandidate) {
                    return updatedCandidate;
                }
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            } else if (Role[role] == Role.company) {
                const updatedCompanyAccount = await this.accountCompanyRepository.update(id, { ...updateData, updated_at: new Date() })
                if (updatedCompanyAccount) {
                    return updatedCompanyAccount;
                }
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }

        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async findByEmail(email: string, role: string) {
        try {
            if (Role[role] == Role.candidate) {
                let candidate = await this.candidateRepository.findOneBy({ email })
                if (!candidate) {
                    throw new HttpException(this.i18n.t('err-message.errors.notFoundAccountByEmail', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
                }
                return candidate;
            }
            if (Role[role] == Role.company) {
                let company = await this.accountCompanyRepository.findOneBy({ email })
                if (!company) {
                    throw new HttpException(this.i18n.t('err-message.errors.notFoundAccountByEmail', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
                }
                return company
            }
            if (role == 'all') {
                let candidate = await this.candidateRepository.findOneBy({ email })
                if (!candidate) {
                    let company = await this.accountCompanyRepository.findOneBy({ email })
                    if (!company) {
                        throw new HttpException(this.i18n.t('err-message.errors.notFoundAccountByEmail', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
                    }
                    return company
                }
                return candidate;
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }
    }
    async findByEmailForResgister(email: string, role: string) {
        try {
            if (Role[role] == Role.candidate) {
                let candidate = await this.candidateRepository.findOneBy({ email })
                if (!candidate) {
                    return false
                }
                return true;
            }
            if (Role[role] == Role.company) {
                let company = await this.accountCompanyRepository.findOneBy({ email })
                if (!company) {
                    return false
                }
                return true;
            }
            if (role == 'all') {
                let candidate = await this.candidateRepository.findOneBy({ email })
                if (!candidate) {
                    let company = await this.accountCompanyRepository.findOneBy({ email })
                    if (!company) {
                        return false
                    }
                    return true;
                }
                return true;
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }
    }
    async findById(id: number, role: string) {
        try {
            if (Role[role] == Role.candidate) {
                let candidate = await this.candidateRepository.findOneBy({ id })
                if (!candidate) {
                    throw new HttpException(this.i18n.t('err-message.errors.notFoundAccountByEmail', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
                }
                return candidate;
            }
            if (Role[role] == Role.company) {
                let company = await this.accountCompanyRepository.findOneBy({ id })
                if (!company) {
                    throw new HttpException(this.i18n.t('err-message.errors.notFoundAccountByEmail', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
                }
                return company
            }
            if (role == 'all') {
                let candidate = await this.candidateRepository.findOneBy({ id })
                if (!candidate) {
                    let company = await this.accountCompanyRepository.findOneBy({ id })
                    if (!company) {
                        throw new HttpException(this.i18n.t('err-message.errors.notFoundAccountByEmail', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
                    }
                    return company
                }
                return candidate;
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }
    }

    async findJobApplicationsForCandidate(candidateId: number) {
        try {
            let jobApplications = await this.jobCandidateRepository.findOne({
                where: {
                    candidate: { id: candidateId }
                }
            })
            if (!jobApplications) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return jobApplications
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }
    }

    async findJobApplicationsForCompany(jobId: number) {
        try {
            let jobApplications = await this.jobCandidateRepository.findOne({
                where: {
                    job: { id: jobId }
                }
            })
            if (!jobApplications) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return jobApplications
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }
    }

    async delete(id: number, role: string) {
        try {
            if (Role[role] == Role.candidate) {
                await this.candidateRepository.delete(id)
                return true
            }
            if (Role[role] == Role.company) {
                throw new HttpException(this.i18n.t('err-message.errors.PermissionInvalid', { lang: I18nContext.current().lang }), HttpStatus.FORBIDDEN, { cause: "Forbiden" })
            }
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }
    }

    async findByIdToSave(id: number, role: string): Promise<Candidate | Account_Company> {
        try {
            if (Role[role] == Role.candidate) {
                let candidate = await this.candidateRepository.findOne({
                    where: { id: id },
                    relations: ['education', 'experience', 'projects', 'certificates', 'skills', 'jobs']
                });
                if (!candidate) {
                    throw new HttpException(this.i18n.t('err-message.errors.notFoundAccountByEmail', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
                }
                return candidate
            }
            if (Role[role] == Role.company) {
                let company = await this.accountCompanyRepository.findOne({
                    where: { id: id },
                    relations: ['companies',
                        'companies.type_company',
                        'companies.jobs',
                        'companies.address_companies',
                        'companies.address_companies.location',
                        'companies.jobs.location',
                        // 'companies.jobs.typeJobs', 
                        'companies.jobs.levelJob',
                        'companies.jobs.candidates'
                    ]
                });
                if (!company) {
                    throw new HttpException(this.i18n.t('err-message.errors.notFoundAccountByEmail', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
                }
                return company
            }
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }
}
