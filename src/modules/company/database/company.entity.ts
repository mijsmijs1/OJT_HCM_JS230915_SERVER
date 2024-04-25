import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account_Company } from "./account_company.entity";
import { Type_Company } from "./type_company.entity";
import { Job } from "src/modules/job/database/job.entity";
import { Address_Company } from "./address_company.entity";
import { Status } from "src/constant/enum";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    account_company_id: number;

    @ManyToOne(() => Account_Company, account => account.companies)
    @JoinColumn({ name: 'account_company_id' })
    account: Account_Company;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @Column({ type: 'varchar', length: 255, default: 'https://i.pinimg.com/originals/ec/d9/c2/ecd9c2e8ed0dbbc96ac472a965e4afda.jpg' })
    logo: string;

    @Column({ type: 'varchar', length: 255, default: "updating" })
    website: string;

    @Column({ type: 'varchar', length: 255, default: "updating" })
    link_fb: string;

    @Column({ type: 'varchar', length: 255, default: "updating" })
    link_linkedin: string;

    @Column({ default: 0 })
    follower: number;

    @Column({ default: 1 })
    size: number;

    @Column({ default: Status.active })
    status: Status;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => Address_Company, address_company => address_company.company)
    address_companies: Address_Company[];

    @Column({ nullable: true })
    type_company_id: number;

    @ManyToOne(() => Type_Company, type_company => type_company.companies)
    @JoinColumn({ name: 'type_company_id' })
    type_company: Type_Company;

    @OneToMany(() => Job, job => job.company)
    jobs: Job[];
}

