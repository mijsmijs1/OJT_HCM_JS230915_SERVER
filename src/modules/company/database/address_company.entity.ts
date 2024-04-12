import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./company.entity";
import { Location } from "./location.entity";

@Entity()
export class Address_Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    company_id: number;

    @ManyToOne(() => Company, company => company.address_companies)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'varchar', length: 255 })
    address: string;

    @Column({ type: "varchar", length: 255 })
    map_url: string;

    @Column()
    location_id: number;

    @OneToOne(() => Location, location => location.address_company)
    @JoinColumn({ name: 'location_id' })
    location: Location;

}