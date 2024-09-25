import {
    Body,
    Controller,
    HttpCode, 
    HttpStatus, 
    Request, 
    UseGuards,
    Post,
    Get,
 } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}


    @HttpCode(HttpStatus.OK)
    @Post('register')
    signup(@Body() input: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    }) {
        return this.authService.authenticate(input);
    }

    @UseGuards(AuthGuard)
    @Get('page')
    getUserInfo(@Request() req) {
        return req.user
    }
}

