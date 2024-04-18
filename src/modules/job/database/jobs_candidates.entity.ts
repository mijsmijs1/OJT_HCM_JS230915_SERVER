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

    @Column({ type: 'int', default: 1 })
    status: number;

    @ManyToOne(() => Job, job => job.candidates)
    @JoinColumn({ name: 'job_id' })
    job: Job;

    @ManyToOne(() => Candidate, candidate => candidate.jobs)
    @JoinColumn({ name: 'candidate_id' })
    candidate: Candidate;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date
}