import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address_Company } from "./address_company.entity";
import { Job } from "src/modules/job/database/job.entity";

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToOne(() => Address_Company, address_company => address_company.location)
    address_company: Address_Company;

    @OneToOne(() => Job, job => job.location)
    job: Job;
}