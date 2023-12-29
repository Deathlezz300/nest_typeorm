import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private readonly configService:ConfigService,
    private readonly jwtService:JwtService
  ){}


  async create(createUserDto:CreateUserDto) {
    
    try{

      const {password,...userData}=createUserDto;

      const user=this.userRepository.create({
        ...userData,
        password:bcrypt.hashSync(
          password,
          10
        )
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token:this.getJwToken({id:user.id})
      };

    }catch(error){
      this.handleDBErros(error)
    }


  }

  private getJwToken(payload:JwtPayload){

    const token=this.jwtService.sign(payload);

    return token;

  }

  async findUser(loginUserDto:LoginUserDto){

    const {password,email}=loginUserDto;

    const User=await this.userRepository.findOne({
      where:{email},
      select:{email:true,password:true,id:true}
    });

    if(!User){
      throw new BadRequestException(`Credentials doesn't match`);
    }

    const userValidate= bcrypt.compareSync(password,User.password);

    if(!userValidate){
      throw new BadRequestException(`Credentials doesn't match`)
    }

    return {
      ...User,
      token:this.getJwToken({id:User.id})
    }

  }

  async CheckToken(user:User){

    const UserFind=await this.userRepository.findOneBy({id:user.id});

    if(!UserFind){
      throw new BadRequestException('User doesn´t exists');
    }

    const token=this.getJwToken({id:user.id});

    return{
      ...user,
      token
    }


  }

  private handleDBErros(errors:any):never{
    if(errors.code==='23505'){
      throw new BadRequestException(errors.detail)
    }

    console.log(errors);

    throw new InternalServerErrorException('Please check server logs');

  }


}
