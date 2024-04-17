import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Company } from './database/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Account_Company } from './database/account_company.entity';
import { Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { SecureUtils } from 'src/shared/utils';
import { Type_Company } from './database/type_company.entity';
import { Address_Company } from './database/address_company.entity';
import { Location } from './database/location.entity';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        @InjectRepository(Account_Company)
        private readonly accountCompanyRepository: Repository<Account_Company>,
        @InjectRepository(Type_Company)
        private readonly typeCompanyRepository: Repository<Type_Company>,
        @InjectRepository(Address_Company)
        private readonly addressCompanyRepository: Repository<Address_Company>,
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
        private readonly i18n: I18nService
    ) { }
    async create(registerData: any): Promise<any | undefined> {
        try {
            const existingEmail = await this.accountCompanyRepository.findOneBy({ email: registerData.email })
            if (existingEmail) {
                throw new HttpException(this.i18n.t('err-message.errors.existingRegisterInfo', { lang: I18nContext.current().lang }), HttpStatus.CONFLICT, { cause: "Conflict" })
            }
            const password = await SecureUtils.hashPassword(registerData.password) as string
            const newCompanyAccount = await this.accountCompanyRepository.create({ ...registerData, password })
            await this.accountCompanyRepository.save(newCompanyAccount)
            return newCompanyAccount
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async createCompany(createData: any): Promise<any | undefined> {
        try {
            let newCompany = new Company();
            newCompany.name = createData.name;
            newCompany.website = createData.website;
            newCompany.link_fb = createData.link_fb;
            newCompany.link_linkedin = createData.link_linkedin;
            newCompany.email = createData.email;
            newCompany.phone = createData.phone;
            newCompany.description = createData.description;
            newCompany.description = createData.description;
            newCompany.account_company_id = createData.account_company_id;
            let type_company = new Type_Company();
            await this.typeCompanyRepository.save(type_company);
            await this.companyRepository.save(newCompany)
            return newCompany
        } catch (error) {
            console.log(error)
            if (error.code === '23505') { // Lỗi mã lỗi Postgres khi trường unique bị vi phạm
                throw new HttpException(
                    this.i18n.t('err-message.errors.duplicateCompanyName', { lang: I18nContext.current().lang }),
                    HttpStatus.CONFLICT,
                    { cause: "Conflict" }
                )
            }
            else if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async createAddress(id: number, createData: any): Promise<any | undefined> {
        try {
            let newAddress = new Address_Company();
            newAddress.address = createData.address;
            newAddress.company_id = id;
            createData.map_url && (newAddress.map_url = createData.map_url);
            let location = new Location();
            location.name = createData.name;
            await this.locationRepository.save(location);
            newAddress.location = location;
            await this.addressCompanyRepository.save(newAddress)
            return newAddress
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async findCompanyByIdFromAccountId(accountId: number, comppanyId: number) {
        try {
            let company = await this.companyRepository.findOneBy({ id: comppanyId, account_company_id: accountId })
            if (!company) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return company;

        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }

    async getById(companyId: number) {
        try {
            let company = await this.companyRepository.findOne({
                where: { id: companyId },
                relations: ['address_companies', 'type_company', 'jobs'] // Thêm các quan hệ mà bạn muốn load
            });

            if (!company) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return company;

        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }

    async getSearch(page: number, pageSize: number, keyword: string, address: string) {
        console.log(page, pageSize, keyword, address)
        try {
            let skip = 0;
            if (page == 1) {
                skip = 1;
            } else {
                skip = (page - 1) * pageSize;
            }
            let query = `
                SELECT *
                FROM Company
                WHERE 1=1
            `;
            if (keyword == 'all' || keyword == '') {
                keyword = '';
            } else {
                query += ` AND (LOWER(Company.name) LIKE LOWER('%${keyword}%'))`;
            }
            if (address == 'all' || address == '') {
                address = '';
            } else {
                query += ` AND Company.id IN (
                    SELECT company_id
                    FROM Address_Company
                    WHERE LOWER(Address_Company.address) LIKE LOWER('%${address}%')
                )`;

            }
            console.log(` LIMIT ${pageSize} OFFSET ${skip}`)
            query += ` LIMIT ${pageSize} OFFSET ${skip}`;
            console.log(query)
            const company = await this.companyRepository.query(query);
            console.log(company)
            if (!company || company.length == 0) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" });
            }
            return company;
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }



}
