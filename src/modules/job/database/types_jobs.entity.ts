import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "./job.entity";
import { TypeJob } from "./typeJob.entity";

@Entity()
export class Types_Jobs {
    @PrimaryGeneratedColumn()
    id: number;

    // Khóa ngoại đến bảng Job
    @ManyToOne(() => Job, job => job.typeJobs)
    @JoinColumn({ name: 'job_id' })
    job: Job;

    // Khóa ngoại đến bảng TypeJob
    @ManyToOne(() => TypeJob, typeJob => typeJob.jobs)
    @JoinColumn({ name: "type_job_id" })
    typeJob: TypeJob;
}
