import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "./job.entity";

@Entity()
export class LevelJob {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => Job, job => job.levelJob)
    jobs: Job[];
}