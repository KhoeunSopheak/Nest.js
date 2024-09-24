import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    const token = authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);

      request.user = {
        userId: tokenPayload.sub,
        first_name: tokenPayload.first_name,
        last_name: tokenPayload.last_name,
        email: tokenPayload.email,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
