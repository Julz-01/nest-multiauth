import { Injectable } from '@nestjs/common';
import { Company } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) { }

    async validate(username: string): Promise<Company | undefined> {
        return await this.prisma.company.findFirst({
            where: { username: username }
        })
    }
}
