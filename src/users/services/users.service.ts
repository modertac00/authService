import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users.model';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.userName) {
      throw new ConflictException('Name is required');
    }
    return await this.userModel.create(userData as User);
  }

  async findByEmail(email: string): Promise<User[]> {
    return await this.userModel.findAll({ where: { email } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    return await user.update(userData);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}