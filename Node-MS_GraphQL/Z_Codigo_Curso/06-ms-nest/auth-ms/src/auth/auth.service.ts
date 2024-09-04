import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RpcException } from "@nestjs/microservices";

import { PrismaClient } from "@prisma/client";

import * as bcrypt from "bcrypt";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  private hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(12);

    return bcrypt.hashSync(password, salt);
  }

  private verifyPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  private validateUserEmail(email: string) {
    return this.user.findUnique({
      where: {
        email,
      },
    });
  }

  private signToken(payload: { id: string; email: string }) {
    return this.jwtService.sign({
      ...payload,
    });
  }

  async register(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    if (await this.validateUserEmail(email))
      throw new RpcException("Email already exists");

    createUserDto.password = this.hashPassword(password);

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password: _,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      active: __,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updatedAt: ___,
      ...user
    } = await this.user.create({
      data: createUserDto,
    });

    return {
      ...user,
      token: this.signToken({
        id: user.id,
        email,
      }),
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const storedUser = await this.validateUserEmail(email);

    if (!storedUser || !this.verifyPassword(password, storedUser.password))
      throw new RpcException("Email or password is invalid");

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password: _,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      active: __,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updatedAt: ___,
      ...user
    } = storedUser;

    return {
      ...user,
      token: this.signToken({
        id: user.id,
        email,
      }),
    };
  }

  verifyToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWTSecret,
    });

    if (!payload) throw new UnauthorizedException();

    return {
      token: this.signToken({ id: payload.id, email: payload.email }),
      user: {
        id: payload.id,
        email: payload.email,
      },
    };
  }
}
