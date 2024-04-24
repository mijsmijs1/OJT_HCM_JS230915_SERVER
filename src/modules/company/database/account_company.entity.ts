import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./company.entity";

@Entity()
export class Account_Company {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Company, company => company.account)
    companies: Company[];

    @Column({ unique: true })
    email: string;

    @Column({ default: false })
    email_status: boolean;

    @Column({ default: "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png" })
    avatar: string;

    @Column({ default: "updating" })
    displayName: string;

    @Column()
    password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}