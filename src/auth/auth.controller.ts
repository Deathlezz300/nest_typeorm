import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto:CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  SigIn(@Body() loginUserDto:LoginUserDto){

    return this.authService.findUser(loginUserDto)

  }

  @Get('check')
  @Auth()
  CheckAuthStatus(
    @GetUser() user:User
  ){
    return this.authService.CheckToken(user)
  }
  
  @Get()
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser(['email','id']) user:User,
    @RawHeaders() rawHeaders:string[]
  ){

      console.log(user)

  }

  @Get('private')
  @RoleProtected(ValidRoles.superUser)
  //@SetMetadata('roles',['admin','super-user'])
  @UseGuards(AuthGuard(),UserRoleGuard)
  testingPrivateRoute2(
    @GetUser() user:User,
  ){

      console.log(user)

  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  testingPrivateRoute3(
    @GetUser() user:User,
  ){

      console.log(user)

  }

}
