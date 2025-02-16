import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/services/users.service";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signup(user: CreateUserDto) {
    // See if email is in use
    const users = await this.usersService.findByEmail(user.email);
    if (users.length) {
      throw new BadRequestException({message: { email: 'Email already exists' },});
    }

    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString("hex");

    // Hash the salt and the password together
    const hash = (await scrypt(user.password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + "." + hash.toString("hex");
    const newUser = { ...user, password: result };
    // Create a new user and save it
    const createdUser = await this.usersService.create(newUser);

    // return the user
    return createdUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("user not found");
    }

    const [salt, storedHash] = user.password.split(".");

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString("hex")) {
      throw new BadRequestException({message: { password: 'wrong password' },});
    }
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      id: user.id,
      email: user.email,
      userName: user.userName,
    };
  }

  private generateAccessToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId }, // Payload
      {
        secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
        expiresIn: "15m", // Set expiration time
      }
    );
  }

  private generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
        expiresIn: "7d",
      }
    );
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });

      const newAccessToken = this.generateAccessToken(payload.sub);
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new BadRequestException("Invalid refresh token");
    }
  }
}
