import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
import { CompanyService } from '../company/company.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private companyService: CompanyService, private jwtService: JwtService) { }

    async login(loginDto: LoginDto): Promise<Object> {
        const user = await this.userService.validate(loginDto.username);

        if (!user) {
            throw new NotFoundException('user not found!')
        }

        if (!await bcrypt.compare(loginDto.password, user.password)) {
            throw new BadRequestException('Wrong Password!')
        }

        const jwt = await this.jwtService.signAsync({
            id: user.id,
            username: user.username,
            role: user.role
        }, { secret: process.env.JWT_SECRET })

        return { access_token: jwt, type: 'bearer' }
    }

    async register(registerDto: RegisterDto): Promise<Object> {
        const checkExists = await this.userService.validate(registerDto.username);

        if (checkExists) {
            throw new BadRequestException(`${registerDto.username} is already used!`)
        }

        const hashedPassword = await this.encryptPassword(registerDto.password);

        const user = await this.userService.register({
            username: registerDto.username,
            password: hashedPassword
        });

        const jwt = await this.jwtService.signAsync({
            id: user.id,
            username: user.username,
            role: user.role
        }, { secret: process.env.JWT_SECRET })

        return { access_token: jwt, type: 'bearer' }
    }

    async encryptPassword(rawPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashed = bcrypt.hashSync(rawPassword, salt);

        return hashed;
    }

    async loginCompany(loginDto: LoginDto): Promise<Object> {
        const company = await this.companyService.validate(loginDto.username);

        if (!company) {
            throw new NotFoundException('company not found')
        }

        if (!await bcrypt.compare(loginDto.password, company.password)) {
            throw new BadRequestException('Wrong Password!')
        }

        const jwt = await this.jwtService.signAsync({
            id: company.id,
            username: company.username,
            name: company.name
        }, { secret: process.env.JWT_SECRET })

        return { access_token: jwt, type: 'bearer' }
    }

}
