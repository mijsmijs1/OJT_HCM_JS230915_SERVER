import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class UpdateEducationCandidateDTO {
    @ApiProperty({
        example: 'Education Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    name_education?: string;

    @ApiProperty({
        example: 'Major',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    major?: string;

    @ApiProperty({
        example: '1990-01-01',
        required: false,
    })
    @Type(() => Date)
    @IsOptional()
    started_at?: Date;

    @ApiProperty({
        example: '1995-01-01',
        required: false,
    })
    @Type(() => Date)
    @IsOptional()
    end_at?: Date;

    @ApiProperty({
        example: 'Additional Info',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    info?: string;
}
