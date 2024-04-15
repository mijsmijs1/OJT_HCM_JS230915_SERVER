import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '../candidate/database/candidate .entity';
import { Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { RegisterAuthDTO } from './dtos/register-auth.dto';
import { error } from 'console';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Candidate)
        private readonly candidateRespository: Repository<Candidate>,
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
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY)
            }
        }
    }
}
