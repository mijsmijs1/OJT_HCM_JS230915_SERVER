import { Company } from "src/modules/company/database/company.entity";
import { Location } from "src/modules/company/database/location.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TypeJob } from "./typeJob.entity";
import { LevelJob } from "./levelJob.entity";
import { Candidate } from "src/modules/candidate/database/candidate.entity";
import { Status } from "src/constant/enum";

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    salary: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date

    @Column({ type: 'timestamp' })
    expire_at: Date

    @Column()
    company_id: number;

    @Column({ default: Status.active })
    status: Status;

    @ManyToOne(() => Company, company => company.jobs)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column()
    location_id: number;

    @OneToOne(() => Location, location => location.job)
    @JoinColumn({ name: 'location_id' })
    location: Location;

    // Quan hệ nhiều-nhiều với TypeJob thông qua bảng trung gian Types_Jobs
    // @ManyToMany(() => TypeJob, typeJob => typeJob.jobs)
    // typeJobs: TypeJob[];

    @ManyToMany(() => TypeJob, { cascade: true })
    @JoinTable()
    typeJobs: TypeJob[];


    @Column()
    levelJob_id: number

    // Quan hệ một-nhiều với LevelJob
    @ManyToOne(() => LevelJob, levelJob => levelJob.jobs)
    levelJob: LevelJob;

    @ManyToMany(() => Candidate, candidate => candidate.jobs)
    candidates: Candidate[];
}