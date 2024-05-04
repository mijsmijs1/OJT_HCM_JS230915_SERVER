import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './database/job.entity';
import { In, Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { TypeJob } from './database/typeJob.entity';
import { Location } from '../company/database/location.entity';
import { Status } from 'src/constant/enum';
import { LevelJob } from './database/levelJob.entity';

@Injectable()
export class JobService {
    constructor(
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
        @InjectRepository(TypeJob)
        private readonly typeJobRepository: Repository<TypeJob>,
        @InjectRepository(LevelJob)
        private readonly levelJobRepository: Repository<LevelJob>,
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
        private readonly i18n: I18nService
    ) { }

    async create(companyId: number, createData: any): Promise<any | undefined> {
        try {
            const newJob = new Job()
            newJob.title = createData.title
            newJob.description = createData.description
            newJob.salary = createData.salary
            newJob.created_at = createData.created_at
            newJob.updated_at = createData.updated_at
            newJob.expire_at = createData.expire_at
            newJob.company_id = companyId;
            const location = new Location();
            location.name = createData.location_name;
            await this.locationRepository.save(location)
            newJob.location_id = location.id
            newJob.levelJob_id = createData.levelJob_id
            const typeJobs = await this.typeJobRepository.findBy({ id: In(createData.typeJobs) })
            newJob.typeJobs = typeJobs
            // const newJob = await this.jobRepository.create({ ...createDate })
            await this.jobRepository.save(newJob)
            return newJob
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }
        }
    }

    async getById(jobId: number) {
        try {
            let job = await this.jobRepository.findOne({
                where: { id: jobId },
                relations: ['typeJobs', 'location', 'levelJob'] // Thêm các quan hệ mà bạn muốn load
            });

            if (!job) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return job;

        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }
    async getJobByCompanyId(companyId: number, page: number, limit: number = 5) {
        try {
            const job = await this.jobRepository.createQueryBuilder("job")
                .leftJoinAndSelect("job.location", "location")
                .leftJoinAndSelect("job.levelJob", "levelJob")
                .where("job.company_id = :companyId", { companyId })
                .andWhere("job.status = :status", { status: Status.active })
                .select(['job.id', 'job.created_at', 'job.expire_at', 'job.title', 'job.salary', 'location', 'levelJob'])
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();
            const count = await this.jobRepository.count({
                where: { company_id: companyId },
            });
            if (!job.length) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return { job, count };

        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }
    async gettypeJob() {
        try {
            let typeJob = await this.typeJobRepository.find();

            if (!typeJob) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return typeJob;

        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }

    async getLevelJob() {
        try {
            let typeJob = await this.levelJobRepository.find();

            if (!typeJob) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
            }
            return typeJob;

        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" })
            }

        }

    }

    async update(id: number, updateData: any) {
        try {
            console.log(updateData)
            let typeJobs = []
            let job = await this.jobRepository.findOneBy({ id })
            if (updateData.typeJobs) {
                typeJobs = await this.typeJobRepository.findBy({ id: In(updateData.typeJobs) })
                console.log('typeJobs tertere', typeJobs)
                job.typeJobs = typeJobs
                delete updateData.typeJobs
            }
            if (updateData.location_name) {
                const location = new Location();
                location.name = updateData.location_name;
                await this.locationRepository.save(location)
                delete updateData.location_name
                updateData.location_id = location.id;
            }
            await this.jobRepository.save(job)
            await this.jobRepository.update(id, { ...updateData, updated_at: new Date(), status: updateData.status == 'inactive' ? Status.inactive : Status.active });
            const updatedItem = await this.jobRepository.find({
                where: { id: id },
                relations: ['typeJobs', 'location', 'levelJob'] // Thêm các quan hệ mà bạn muốn load
            });;
            return updatedItem[0];
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw error; // Re-throw the existing HttpException
            } else {
                throw new HttpException(this.i18n.t('err-message.errors.databaseConnectFailed', { lang: I18nContext.current().lang }), HttpStatus.BAD_GATEWAY, { cause: "Bad Gateway" });
            }
        }
    }

    async getSearch(page: number, pageSize: number, keyword: string, address: string, typeJobIdArray: number[]) {
        try {
            let skip = 0;
            if (page > 1) {
                skip = (page - 1) * pageSize;
            }

            let queryBuilder = await this.jobRepository
                .createQueryBuilder("job")
                .leftJoinAndSelect("job.location", "location")
                .innerJoinAndSelect("job.typeJobs", "typeJob")
                .andWhere("job.status = :status", { status: Status.active }) // Thêm điều kiện status active
                .skip(skip)
                .take(pageSize)

            if (keyword !== 'all') {
                queryBuilder = queryBuilder.andWhere("LOWER(job.title) LIKE LOWER(:keyword)", { keyword: `%${keyword}%` });
            }

            if (address !== 'all') {
                queryBuilder = queryBuilder.andWhere("LOWER(location.name) LIKE LOWER(:address)", { address: `%${address}%` });
            }
            if (typeJobIdArray && typeJobIdArray.length > 0) {

                queryBuilder = queryBuilder.andWhere("typeJob.id IN (:...typeJobIds)", { typeJobIds: typeJobIdArray });
            }
            let jobs = await queryBuilder.getMany();

            if (!jobs || jobs.length === 0) {
                throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" });
            }

            return jobs;
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
