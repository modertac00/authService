import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../users.model";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "../dto/user-response.dto";

@Injectable()
export class UserQueryService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}

  async findAll(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<{ users: UserResponseDto[]; total: number }> {
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { userName: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { phone: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await this.userModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });

    return {
      users: plainToInstance(
        UserResponseDto,
        rows.map((user) => user.toJSON()),
        { excludeExtraneousValues: true }
      ),
      total: count,
    };
  }
}
