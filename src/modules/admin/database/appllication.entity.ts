import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Admin } from './admin.entity'
@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    nameJob: string;

    @Column({ default: 1 })
    jobDescription: number;

    @Column({ type: 'varchar', unique: true })
    company: string;

    @Column({ nullable: true })
    salaryMin: number;

    @Column({ type: 'varchar' })
    salaryMax: number;

    @Column({ type: 'timestamp' })
    applicationEnd: Date;
    @ManyToMany(() => Admin, { cascade: true })
    @JoinTable()
    admin: Admin[];

}