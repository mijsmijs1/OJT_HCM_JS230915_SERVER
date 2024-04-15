import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity()
export class SkillsCandidate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    candidate_id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    level_job_id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToOne(() => Candidate, (candidate: any) => candidate.skills)
    @JoinColumn({ name: 'candidate_id' })
    candidate: Candidate;
}
