import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Min } from "class-validator";

export class PaginationDTO{

    @ApiProperty({
        default:10,
        description:'How many product do you need'
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?:number;

    @ApiProperty({
        default:0,
        example:'How many products do you want to skip'
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    offset?:number;

}