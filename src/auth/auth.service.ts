import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { isInstance } from "class-validator";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { deepStrictEqual } from "assert";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{
    constructor(
        private config: ConfigService,
        private jwt: JwtService,
        private prisma: PrismaService,
    ){}

    async signup(dto: AuthDto){
        //generate password hash using argon2
        const hash = await argon.hash(dto.password)

        // save new user in database
        try{
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                }
            })
            return this.signToken(user.id, user.email)

        } catch (error){

            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002' && error.meta.target[0] === 'email'){
                throw new BadRequestException('email already exists')
            }

            throw error
        }

        //return user

    }

    async signin(dto: AuthDto){
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })

        if (!user){
            throw new ForbiddenException('wrong email or password')
        }

        const passwordMatch = await argon.verify(user.hash, dto.password)

        if (!passwordMatch){
            throw new ForbiddenException('wrong email or password')
        }

        return this.signToken(user.id, user.email)

    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }>{
        const payload = {
            sub: userId,
             email
            }

            const secret = this.config.get('JWT_SECRET')

            const token = await this.jwt.signAsync(
                payload, {
                    expiresIn: '1d',
                    secret: secret
                }
            )
            return { access_token: token}
        
    }
}