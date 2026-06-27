import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string, withPassword = false): Promise<User | null> {
    const qb = this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email.toLowerCase() })
    if (withPassword) qb.addSelect('user.password')
    return qb.getOne()
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } })
  }

  async create(data: { email: string; name: string; password: string }): Promise<User> {
    const user = this.usersRepository.create({
      ...data,
      email: data.email.toLowerCase(),
    })
    return this.usersRepository.save(user)
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (dto.email !== undefined) {
      const existing = await this.findByEmail(dto.email)
      if (existing && existing.id !== userId) {
        throw new ConflictException('Email is already in use')
      }
      user.email = dto.email
    }

    if (dto.name !== undefined) {
      user.name = dto.name
    }

    return this.usersRepository.save(user)
  }
}
