import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Candidate } from './candidate .entity';

@Entity('Education_Candidate')
export class EducationCandidate {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    candidate_id: string;

    @Column({ type: 'varchar' })
    name_education: string;

    @Column({ type: 'varchar' })
    major: string;

    @Column({ type: 'timestamp' })
    started_at: Date;

    @Column({ type: 'timestamp' })
    end_at: Date;

    @Column({ type: 'varchar' })
    info: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToOne(() => Candidate, (candidate: any) => candidate.education)
    @JoinColumn({ name: 'candidate_id' })
    candidate: Candidate;
}