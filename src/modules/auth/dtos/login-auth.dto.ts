import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/constant/enum";

export class LoginAuthDTO {

    @ApiProperty({
        example: '123@gmail.com',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: '123456',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ default: 1, example: 'Candidate|Company', required: true })
    @IsString()
    @IsNotEmpty()
    role: Role;
}