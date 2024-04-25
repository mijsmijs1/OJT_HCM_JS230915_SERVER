
import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './database/application.entity';
import { Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Admin } from '../admin/database/admin.entity';
@Global()
@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
        private readonly i18n: I18nService
    ) { }
    async createApplication(createData: any) {
        try {
            const newApplication = await this.applicationRepository.create({
                ...createData,
            })
            await this.applicationRepository.save(newApplication)
            return newApplication
        } catch (error) {
            console.log("lỗi service", error);

            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }
    async findAllApplications() {
        try {
            const applications = await this.applicationRepository.find();
            return applications;
        } catch (error) {
            console.log("Error while finding applications:", error);
            throw new HttpException(
                this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }),
                HttpStatus.BAD_GATEWAY,
                { cause: "Bad Gateway" }
            );
        }
    }
    async updateApplication(id: number, updateApplication: any) {
        try {
            await this.applicationRepository.update(id, { ...updateApplication })
            const newUpdate = await this.applicationRepository.findOneBy({ id });
            return newUpdate
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }
    async DeleteApllication(id: number) {
        try {
            await this.applicationRepository.delete(id)
        } catch (error) {
            console.log("lỗi service application del", error);

            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }

    }

}
