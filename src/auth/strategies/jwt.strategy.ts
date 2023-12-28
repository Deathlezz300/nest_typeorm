import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private readonly userRespotiroy:Repository<User>,
        confiService:ConfigService
    ){
        super({
            secretOrKey:confiService.get('JWT_SEED'),
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload:JwtPayload):Promise<User>{

        const {id}=payload;

        const user=await this.userRespotiroy.findOneBy({id});

        if(!user){
            throw new UnauthorizedException(`Token not valid`);
        }

        if(!user.isActive){
            throw new UnauthorizedException('User is inactive, talk with an admin')
        }
        
        return user;

    }


}