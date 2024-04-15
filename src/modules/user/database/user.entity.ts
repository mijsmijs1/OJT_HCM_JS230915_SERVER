import { CandidateGender, Role } from 'src/constant/enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: Role.candidate })
  role: Role;

  @Column({ default: 'http://surl.li/rrtgf' }) // Giá trị mặc định là 'default-avatar.jpg'
  avatar: string;

  @Column({ default: CandidateGender.MALE }) // Thêm cột giới tính, ví dụ "male" hoặc "female"
  gender: CandidateGender;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

}
