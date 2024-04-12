import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { EducationCandidate } from './education_candidate.entity';
import { ExperienceCandidate } from './experience_candidate.entity';
import { ProjectCandidate } from './project_candidate.entity';
import { CertificateCandidate } from './certificate_candidate.entity';
import { SkillsCandidate } from './skill_candidate.entity';

@Entity()
export class Candidate {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ default: 0 })
    isOpen: number;

    @Column({ type: 'timestamp' })
    dob: Date;

    @Column({ type: 'varchar' })
    address: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column()
    phone: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column()
    gender: number;

    @Column({ type: 'varchar' })
    link_fb: string;

    @Column({ type: 'varchar' })
    link_linkedin: string;

    @Column({ type: 'varchar' })
    link_git: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => EducationCandidate, (education: any) => education.candidate)
    education: EducationCandidate[];

    @OneToMany(() => ExperienceCandidate, (experience: any) => experience.candidate)
    experience: ExperienceCandidate[];

    @OneToMany(() => ProjectCandidate, (project: any) => project.candidate)
    projects: ProjectCandidate[];

    @OneToMany(() => CertificateCandidate, (certificate: any) => certificate.candidate)
    certificates: CertificateCandidate[];

    @OneToMany(() => SkillsCandidate, (skill: any) => skill.candidate)
    skills: SkillsCandidate[];
}
