import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./company.entity";

@Entity()
export class Type_Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, default: 'IT' })
    name: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
    @OneToMany(() => Company, company => company.type_company)
    companies: Company[];
}