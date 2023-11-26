import { Get, Patch } from "@nestjs/common";
import { UserService } from "./user.service";


export class UserController{
    constructor(private userService: UserService){}

    @Get('me')
    getme(){
        return "Hello Me"
    }

    @Patch()
    editUser(){
        return "Hello Edit User"
    }
}




