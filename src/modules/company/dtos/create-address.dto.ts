import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";



export class CreateAddressDTO {
    @ApiProperty({
        example: '123',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    name: string;

    @ApiProperty({
        example: '123456',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    address: string;

    @ApiProperty({
        example: '123456',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    map_url?: string;
}