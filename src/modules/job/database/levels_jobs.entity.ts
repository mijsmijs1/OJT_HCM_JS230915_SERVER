import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "./job.entity";
import { LevelJob } from "./levelJob.entity";

@Entity()
export class Types_Jobs {
    @PrimaryGeneratedColumn()
    id: number;
    // Khóa ngoại đến bảng Job
    @ManyToOne(() => Job, job => job.id)
    @JoinColumn({ name: 'job_id' })
    job: Job;
    // Khóa ngoại đến bảng TypeJob
    @ManyToOne(() => LevelJob, LevelJob => LevelJob.id)
    @JoinColumn({ name: "level_job_id" })
    levelJob: LevelJob;
}