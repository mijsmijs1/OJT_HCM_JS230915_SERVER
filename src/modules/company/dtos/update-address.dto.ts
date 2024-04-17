import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";



export class UpdateAddressDTO {
    @ApiProperty({
        example: '123',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    name: string;

    @ApiProperty({
        example: '123456',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    address: string;

    @ApiProperty({
        example: '123456',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    map_url?: string;
}