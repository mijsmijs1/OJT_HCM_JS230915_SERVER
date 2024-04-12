import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account_Company } from "./account_company.entity";
import { Type_Company } from "./type_company.entity";
import { Job } from "src/modules/job/database/job.entity";
import { Address_Company } from "./address_company.entity";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    account_company_id: number;

    @ManyToOne(() => Account_Company, account => account.companies)
    @JoinColumn({ name: 'account_company_id' })
    account: Account_Company;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    logo: string;

    @Column({ type: 'varchar', length: 255 })
    website: string;

    @Column({ type: 'varchar', length: 255 })
    link_fb: string;

    @Column({ type: 'varchar', length: 255 })
    link_likedin: string;

    @Column({ default: 0 })
    follower: number;

    @Column({ default: 1 })
    size: number;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => Address_Company, address_company => address_company.company)
    address_companies: Address_Company[];

    @Column()
    type_company_id: number;

    @ManyToOne(() => Type_Company, type_company => type_company.companies)
    @JoinColumn({ name: 'type_company_id' })
    type_company: Type_Company;

    @OneToMany(() => Job, job => job.company)
    jobs: Job[];
}

