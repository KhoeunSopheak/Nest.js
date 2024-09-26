import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

type AuthInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

type SignupData = {
  userId: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

type AuthResult = {
  accessToken: string;
};

type AuthLoginInput = {
  email: string;
  password: string;
};

type LoginData = {
  userId: number;
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: AuthInput): Promise<AuthResult> {
    const user = await this.registerUser(input);

    if (!user) {
      throw new UnauthorizedException('User registration failed');
    }

    return this.generateAccessToken(user);
  }

  async registerUser(input: AuthInput): Promise<SignupData | null> {
    const hashedPassword = await this.hashPassword(input.password);

    const user = await this.usersService.registerUser(
      input.first_name,
      input.last_name,
      input.email,
      hashedPassword,
    );

    if (user) {
      const signupData: SignupData = {
        userId: user.userId,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: hashedPassword,
      };
      return signupData;
    }

    return null;
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

async generateAccessToken(user: SignupData | LoginData): Promise<AuthResult> {
    const tokenPayload: any = {
        sub: user.userId,
        email: user.email,
    };

    if ('first_name' in user && 'last_name' in user) {
        tokenPayload.first_name = user.first_name;
        tokenPayload.last_name = user.last_name;
    }

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
        accessToken,
    };
}

  async login(input: AuthLoginInput): Promise<AuthResult> {
    const user = await this.validateLoginUser(input);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateAccessToken(user);
  }

  async validateLoginUser(input: AuthLoginInput): Promise<LoginData | null> {
    const user = await this.usersService.findByEmail(input.email);

    if (user && (await bcrypt.compare(input.password, user.password))) {
      const loginData: LoginData = {
        userId: user.userId,
        email: user.email,
        password: user.password,
      };
      return loginData;
    }

    return null;
  }
}
