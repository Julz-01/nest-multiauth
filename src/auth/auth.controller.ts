import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto): Promise<Object> {
        return await this.authService.login(body);
    }

    @Post('register')
    async register(@Body() body: RegisterDto): Promise<Object> {
        return await this.authService.register(body);
    }

    @Post('company/login')
    async loginCompany(@Body() body: LoginDto): Promise<Object> {
        return await this.authService.loginCompany(body);
    }
}
