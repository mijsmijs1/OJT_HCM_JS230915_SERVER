import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateApplicationDTO {
    @ApiProperty({
        example: 'Fullstack Development',

    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    nameJob: string;

    @ApiProperty({
        example: 'knowlage',
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    jobDetail: string;

    @ApiProperty({
        example: 'company fpt'
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    company: string;

    @ApiProperty({ example: '20' })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    salaryMin: string;

    @ApiProperty({ example: '25' })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    salaryMax: string;

    @ApiProperty({
        example: '2023-01-01',
    })
    applicationEnd: string;
}