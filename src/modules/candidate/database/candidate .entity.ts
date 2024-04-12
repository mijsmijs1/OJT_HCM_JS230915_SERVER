import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { EducationCandidate } from './education_candidate.entity';
import { ExperienceCandidate } from './experience_candidate.entity';
import { ProjectCandidate } from './project_candidate.entity';
import { CertificateCandidate } from './certificate_candidate.entity';
import { SkillsCandidate } from './skill_candidate.entity';
import { CandidateGender } from 'src/constant/enum';
import { Job } from 'src/modules/job/database/job.entity';

@Entity()
export class Candidate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ default: 0 })
    isOpen: number;

    @Column({ type: 'timestamp' })
    dob: Date;

    @Column({ type: 'varchar', nullable: true })
    address: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ nullable: true })
    gender: CandidateGender;

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

    @ManyToMany(() => Job, job => job.candidates)
    jobs: Job[];
}
