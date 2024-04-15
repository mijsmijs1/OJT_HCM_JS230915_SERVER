import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "./job.entity";
import { Candidate } from "src/modules/candidate/database/candidate.entity";

@Entity()
export class Jobs_Candidates {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    cv_url: string;

    @Column({ type: 'varchar', length: 255 })
    content: string;

    @Column({ type: 'int', default: 0 })
    status: number;

    @ManyToOne(() => Job, job => job.id)
    @JoinColumn({ name: 'job_id' })
    job: Job;

    @ManyToOne(() => Candidate, candidate => candidate.id)
    @JoinColumn({ name: 'candidate_id' })
    candidate: Candidate;

}