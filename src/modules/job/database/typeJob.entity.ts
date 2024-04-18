import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "./job.entity";

@Entity()
export class TypeJob {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    // @ManyToMany(() => Job, job => job.typeJobs)
    // jobs: Job[];

    @ManyToMany(() => Job, { cascade: true })
    @JoinTable()
    jobs: Job[];
}