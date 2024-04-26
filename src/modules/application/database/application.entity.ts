import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Admin } from '../../admin/database/admin.entity'
@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar' })
    nameJob: string;
    @Column({ type: 'varchar' })
    jobDetail: string;
    @Column({ type: 'varchar' })
    company: string;
    @Column({ type: 'varchar' })
    salaryMin: string;
    @Column({ type: 'varchar' })
    salaryMax: string;
    @Column({ type: 'varchar' })
    applicationEnd: string;
    @ManyToMany(() => Admin, { cascade: true })
    @JoinTable()
    admin: Admin[];

}