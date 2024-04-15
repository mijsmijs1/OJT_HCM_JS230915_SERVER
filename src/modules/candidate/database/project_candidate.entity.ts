import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity()
export class ProjectCandidate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    candidate_id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    link: string;

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

    @ManyToOne(() => Candidate, (candidate: any) => candidate.projects)
    @JoinColumn({ name: 'candidate_id' })
    candidate: Candidate;
}