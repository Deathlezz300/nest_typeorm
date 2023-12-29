import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser=createParamDecorator(
    (data:string[],ctx:ExecutionContext)=>{

        const request=ctx.switchToHttp().getRequest();

        const user=request.user;

        if(!user){
            throw new InternalServerErrorException('User not found (request)')
        }

        if(data){
            let finalObject={};
            data.forEach(dt=>{
                finalObject[dt]=user[dt];
            });
            
            return finalObject;
        }

        return user;

    }
)