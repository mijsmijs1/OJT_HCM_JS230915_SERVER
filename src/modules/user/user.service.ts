import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './database/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { CandidateGender } from 'src/constant/enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }
  async findAll() {
    return await this.userRepository.find();
  }

  async findUserBy(data) {
    const user = await this.userRepository.findOne({ where: { email: data.email } });

    return user
  }
  async create(userData: CreateUserDto): Promise<User> {
    const gender = userData.gender
    if (gender === CandidateGender.MALE) {
      userData.avatar = 'http://surl.li/rrtgf';
    } else if (gender === CandidateGender.FEMALE) {
      userData.avatar = 'http://surl.li/rrtpe';
    } else {
      userData.avatar = 'http://surl.li/rrtgf';
    }
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async update(id, userData: UpdateUserDTO): Promise<User> {
    await this.userRepository.update(id, userData);
    return await this.userRepository.findOne(id);
  }

  async findOneByEmail(email: any) {
    const data = await this.userRepository.findOneBy({ email: email });

    return data;
  }
}
