import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Application } from "../../application/database/application.entity"
@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ default: 1 })
    isAdmin: number;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    gender: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
    @ManyToMany(() => Application, { cascade: true })
    @JoinTable()
    admin: Application[];

}
