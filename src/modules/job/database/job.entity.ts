import { Company } from "src/modules/company/database/company.entity";
import { Location } from "src/modules/company/database/location.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TypeJob } from "./typeJob.entity";
import { LevelJob } from "./levelJob.entity";
import { Candidate } from "src/modules/candidate/database/candidate .entity";

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

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    expire_at: Date

    @Column()
    conpany_id: number;

    @ManyToOne(() => Company, company => company.jobs)
    @JoinColumn({ name: 'conpany_id' })
    company: Company;

    @Column()
    location_id: number;

    @OneToOne(() => Location, location => location.job)
    @JoinColumn({ name: 'location_id' })
    location: Location;

    // Quan hệ nhiều-nhiều với TypeJob thông qua bảng trung gian Types_Jobs
    @ManyToMany(() => TypeJob, typeJob => typeJob.jobs)
    typeJobs: TypeJob[];

    // Quan hệ nhiều-nhiều với TypeJob thông qua bảng trung gian Levels_Jobs
    @ManyToMany(() => LevelJob, levelJob => levelJob.jobs)
    levelJobs: TypeJob[];

    @ManyToMany(() => Candidate, candidate => candidate.jobs)
    candidates: Candidate[];
}