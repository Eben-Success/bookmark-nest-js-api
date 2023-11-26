import { Injectable } from "@nestjs/common";
import { EditUserDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService{
    constructor(private prisma: PrismaService){}

    async editUser(userId: string, dto: EditUserDto){
         const user = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                email: dto.email,
                firstname: dto.firstname,
                lastname: dto.lastname,
                hash: dto.password
            }
         });
         delete user.hash
         return user
    }
}