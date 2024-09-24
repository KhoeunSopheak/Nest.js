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

type AuthResulf = {
    accessToken: string;
};

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
                private readonly jwtService: JwtService) {}

    async authenticate(input:AuthInput): Promise<AuthResulf> {
        const user = await this.validateUser(input);

        if(!user) {
            throw new UnauthorizedException();
        }

        return this.signup(user);      
    }

    async validateUser(input: AuthInput): Promise<SignupData | null> {
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

    async signup(user: SignupData): Promise<AuthResulf> {
        const tokenPayload = {
            sub: user.userId,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        };

        const accessToken = await this.jwtService.signAsync(tokenPayload);

        return {
            accessToken,
        };
    }

    async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }

}

