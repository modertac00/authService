import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { SignInDto } from "./dto/signin-dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signin")
  signIn(@Body() body: SignInDto) {
    const { email, password } = body;
    return this.authService.signin(email, password);
  }

  @Post("signup")
  signUp(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post("refresh")
  async refresh(@Body("refreshToken") refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
