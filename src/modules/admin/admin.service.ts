
import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './database/admin.entity';
import { Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { RegisterAdminDTO } from './dtos/register-admin.dto';
import { SecureUtils } from 'src/shared/utils/secure.util';
@Injectable()
@Global()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly AdminRepository: Repository<Admin>,
        private readonly i18n: I18nService
    ) { }

    async register(registerAdminData: RegisterAdminDTO): Promise<Admin | undefined> {
        try {
            const existingEmail = await this.AdminRepository.findOneBy({ email: registerAdminData.email })
            //trung email//
            if (existingEmail) {
                throw new HttpException(this.i18n.t('err-message.errors.existingRegisterInfo', { lang: I18nContext.current().lang }), HttpStatus.CONFLICT, { cause: "Conflict" })
            }
            //hash pasword//
            const password = await SecureUtils.hashPassword(registerAdminData.password) as string
            //new admin//
            const newAdmin = await this.AdminRepository.create({ ...registerAdminData, password })
            await this.AdminRepository.save(newAdmin)
            return newAdmin
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }
    async findByEmail(email: string) {
        try {
            const admin = await this.AdminRepository.findOneBy({ email });
            if (admin.isAdmin != 1) {
                throw new HttpException(this.i18n.t('err-message.errors.notFoundAccountByEmail', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return admin
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }
    async findById(id: number) {
        try {
            const admin = await this.AdminRepository.findOneBy({ id });
            if (admin.isAdmin != 1) {
                throw new HttpException(
                    this.i18n.t('err-message.errors.notFoundAccountById', { lang: I18nContext.current().lang }),
                    HttpStatus.NOT_FOUND,
                    { cause: "Not Found" }
                );
            }
            return admin
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }),
                    HttpStatus.BAD_GATEWAY,
                    { cause: "Bad Gateway" }
                );
            }
        }
    }
}

