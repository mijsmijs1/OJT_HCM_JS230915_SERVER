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

    @Column()
    password: string;
}