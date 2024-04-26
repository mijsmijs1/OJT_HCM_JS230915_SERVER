import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class updateApplicationDTO {
    @ApiProperty({
        example: 'Fullstack Development',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    nameJob: string;

    @ApiProperty({
        example: 'Knowlage',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    jobDetail: string;

    @ApiProperty({
        example: 'Company',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    company: string;

    @ApiProperty({
        example: '20',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    salaryMin: string;

    @ApiProperty({
        example: '25',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    salaryMax: string;

    @ApiProperty({
        example: '2023-12-31',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    applicationEnd: string;



}