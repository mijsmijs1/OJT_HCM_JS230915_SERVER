import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { EducationCandidate } from './education_candidate.entity';
import { ExperienceCandidate } from './experience_candidate.entity';
import { ProjectCandidate } from './project_candidate.entity';
import { CertificateCandidate } from './certificate_candidate.entity';
import { SkillsCandidate } from './skill_candidate.entity';
import { Job } from 'src/modules/job/database/job.entity';

@Entity()
export class Candidate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ default: 1 })
    isOpen: number;

    @Column({ type: 'timestamp', nullable: true })
    dob: Date;

    @Column({ type: 'varchar', nullable: true })
    address: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ default: false })
    email_status: boolean;


    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'varchar' })
    password: string;


    @Column({ type: 'varchar', nullable: true })
    gender: string;

    @Column({ type: 'varchar', nullable: true })
    link_fb: string;

    @Column({ type: 'varchar', nullable: true })
    link_linkedin: string;

    @Column({ type: 'varchar', nullable: true })
    link_git: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => EducationCandidate, (education: any) => education.candidate, { cascade: true })
    education: EducationCandidate[];

    @OneToMany(() => ExperienceCandidate, (experience: any) => experience.candidate, { cascade: true })
    experience: ExperienceCandidate[];

    @OneToMany(() => ProjectCandidate, (project: any) => project.candidate, { cascade: true })
    projects: ProjectCandidate[];

    @OneToMany(() => CertificateCandidate, (certificate: any) => certificate.candidate, { cascade: true })
    certificates: CertificateCandidate[];

    @OneToMany(() => SkillsCandidate, (skill: any) => skill.candidate, { cascade: true })
    skills: SkillsCandidate[];

    @ManyToMany(() => Job, { cascade: true })
    @JoinTable()
    jobs: Job[];


}
