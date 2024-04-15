import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '../candidate/database/candidate.entity';
import { Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { RegisterAuthDTO } from './dtos/register-auth.dto';
import { Role } from 'src/constant/enum';
import { Company } from '../company/database/company.entity';
import { Account_Company } from '../company/database/account_company.entity';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Candidate)
        private readonly candidateRespository: Repository<Candidate>,
        @InjectRepository(Company)
        private readonly companyRespository: Repository<Company>,
        @InjectRepository(Account_Company)
        private readonly accountCompanyRespository: Repository<Account_Company>,
        private readonly i18n: I18nService
    ) { }

    async create(registerData: RegisterAuthDTO): Promise<Candidate | undefined> {
        try {
            const existingEmail = await this.candidateRespository.findOneBy({ email: registerData.email })
            if (existingEmail) {
                throw new HttpException(this.i18n.t('err-message.errors.existingRegisterInfo', { lang: I18nContext.current().lang }), HttpStatus.CONFLICT, { cause: "Conflict" })
            }
            const newCandidate = await this.candidateRespository.create({ ...registerData })
            await this.candidateRespository.save(newCandidate)
            return newCandidate
        } catch (error) {
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
                let candidate = await this.candidateRespository.findOneBy({ email })
                if (!candidate) {
                    throw new HttpException(this.i18n.t('err-message.errors.notFoundAccountByEmail', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
                }
                return candidate;
            }
            if (Role[role] == Role.company) {
                let company = await this.accountCompanyRespository.findOneBy({ email })
                if (!company) {
                    throw new HttpException(this.i18n.t('err-message.errors.notFoundAccountByEmail', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
                }
                return company
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }
    }
}
