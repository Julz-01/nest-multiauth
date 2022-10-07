import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto } from 'src/auth/dto/register-dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async validate(username: string): Promise<User | undefined> {
        return await this.prisma.user.findFirst({
            where: { username: username }
        });
    }

    async register(registerDto: RegisterDto): Promise<User | undefined> {
        return await this.prisma.user.create({
            data: {
                username: registerDto.username,
                password: registerDto.password
            }
        });
    }
}
