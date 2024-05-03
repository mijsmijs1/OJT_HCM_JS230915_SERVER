import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Type_Company } from "src/modules/company/database/type_company.entity";
import { LevelJob } from "src/modules/job/database/levelJob.entity";
import { TypeJob } from "src/modules/job/database/typeJob.entity";
import { Repository } from "typeorm";

@Injectable()
export class DefaultEntriesService {
    constructor(
        @InjectRepository(TypeJob)
        private readonly typeJobRepository: Repository<TypeJob>,
        @InjectRepository(LevelJob)
        private readonly levelJobRepository: Repository<LevelJob>,
        @InjectRepository(Type_Company)
        private readonly TypeCompanyRepository: Repository<Type_Company>
    ) { }
    async createDefaultTypeJob() {
        try {
            const typeJobNames = [
                'JavaScript', 'TypeScript', 'Python', 'Ruby', 'PHP', 'C#', 'C++', 'Swift', 'Kotlin', 'Go', 'Rust', 'Scala', 'Perl',
                'Shell Scripting', '.NET', 'Angular', 'Vue.js', 'Django', 'Flask', 'Laravel', 'Ruby on Rails', 'Express.js', 'ASP.NET',
                'Spring Boot', 'Hibernate', 'SQL Server', 'PostgreSQL', 'MongoDB', 'Oracle', 'Firebase', 'Docker', 'Kubernetes', 'AWS',
                'Azure', 'Google Cloud', 'DevOps', 'Agile', 'Scrum', 'Kanban', 'CI/CD', 'Git', 'SVN', 'Jira', 'Trello', 'Linux', 'Unix',
                'Windows Server', 'Cybersecurity', 'Machine Learning', 'Data Science', 'AI', 'Big Data', 'Hadoop', 'Spark', 'TensorFlow',
                'Blockchain'
            ];
            const existingTypeJob = await this.typeJobRepository.findOne({ where: { name: typeJobNames[0] } });
            if (!existingTypeJob) {
                for (const name of typeJobNames) {
                    const typeJob = this.typeJobRepository.create({ name });
                    await this.typeJobRepository.save(typeJob);
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    async createDefaultLevelJob() {
        try {
            const levelJobNames = [
                'Intern', 'Fresher', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager'
            ];
            const existingLevelJob = await this.levelJobRepository.findOne({ where: { name: levelJobNames[0] } });
            if (!existingLevelJob) {
                for (const name of levelJobNames) {
                    const levelJob = this.levelJobRepository.create({ name });
                    await this.levelJobRepository.save(levelJob);
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    async createDefaultTypeCompany() {
        try {
            const typeCompanyNames = [
                'Outsource', 'Product', 'Startups', 'Service', 'R&D', 'Hardware'
            ];
            const existingTypeCompany = await this.TypeCompanyRepository.findOne({ where: { name: typeCompanyNames[0] } });
            if (!existingTypeCompany) {
                for (const name of typeCompanyNames) {
                    const typeCompany = this.TypeCompanyRepository.create({ name });
                    await this.TypeCompanyRepository.save(typeCompany);
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
}