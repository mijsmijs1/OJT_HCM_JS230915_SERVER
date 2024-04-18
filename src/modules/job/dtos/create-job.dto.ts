import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class CreateJobDto {
    @ApiProperty({
        example: 'Job Title',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    title: string;

    @ApiProperty({
        example: 'Job Description',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    description: string;

    @ApiProperty({
        example: '5000 USD',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    salary: string;

    @ApiProperty({
        example: new Date(),
        required: false,
    })
    @IsOptional()
    @Type(() => Date)
    created_at?: Date;


    @ApiProperty({
        example: new Date(),
        required: true,
    })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    @Type(() => Date)
    expire_at: Date;

    @ApiProperty({
        example: 1,
        required: true,
    })
    @IsNumber({}, { message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    company_id: number;

    @ApiProperty({
        example: "Hoc Mon",
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    location_name: string;

    // @ApiProperty({
    //     example: 1,
    //     required: true,
    // })
    // @IsNumber({}, { message: 'validation.COMMON_ERROR' })
    // @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    // location_id: number;

    @ApiProperty({
        example: [1, 2],
        required: false,
    })
    typeJobs: number[];

    @ApiProperty({
        example: 1,
        required: true,
    })
    @IsNumber({}, { message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    levelJob_id: number;

}
