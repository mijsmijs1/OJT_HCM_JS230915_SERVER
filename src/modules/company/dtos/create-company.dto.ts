import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, IsOptional } from "class-validator";

export class CreateCompanyDTO {

    @ApiProperty({
        example: 'Company Name',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    name: string;

    @ApiProperty({
        example: 'https://example.com/logo.png',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    logo?: string;

    @ApiProperty({
        example: 'https://example.com',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    website: string;

    @ApiProperty({
        example: 'https://www.facebook.com/company',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    link_fb: string;

    @ApiProperty({
        example: 'https://www.linkedin.com/company',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    link_linkedin: string;

    @ApiProperty({
        example: '1000',
        required: false,
    })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    follower?: number;

    @ApiProperty({
        example: '1',
        required: false,
    })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    size?: number;

    @ApiProperty({
        example: 'company@example.com',
        required: true,
    })
    @IsEmail({}, { message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    email: string;

    @ApiProperty({
        example: '0123456789',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    phone: string;

    @ApiProperty({
        example: 'Company Description',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    description: string;


}
