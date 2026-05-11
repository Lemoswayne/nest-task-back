import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Aqui eu puxo os dados do DTO
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.password = await this.hashingService.hash(user.password);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    tokenPayload: TokenPayloadDto,
  ): Promise<User> {
    const user = await this.findOne(id);
    const updated = Object.assign(user, updateUserDto);
    if (updateUserDto.password) {
      updated.password = await this.hashingService.hash(updateUserDto.password);
    }

    if (!user) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (String(user.id) !== String(tokenPayload.sub)) {
      throw new ForbiddenException('Você não é essa pessoa.');
    }
    return this.userRepository.save(updated);
  }

  async remove(id: string, tokenPayload: TokenPayloadDto): Promise<void> {
    const user = await this.findOne(id);
    if (String(user.id) !== String(tokenPayload.sub)) {
      throw new ForbiddenException('Você não é essa pessoa.');
    }
    await this.userRepository.remove(user);
  }
}
