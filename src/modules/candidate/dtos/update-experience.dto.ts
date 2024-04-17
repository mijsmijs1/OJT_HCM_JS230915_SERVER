import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional, IsString } from "class-validator";

export class UpdateExperienceCandidateDTO {
    @ApiProperty({
        example: 'Position Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    position?: string;

    @ApiProperty({
        example: 'Company Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    company?: string;

    @ApiProperty({
        example: '2020-01-01',
        required: false,
    })
    @IsDate({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    started_at?: Date;

    @ApiProperty({
        example: '2022-12-31',
        required: false,
    })
    @IsDate({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    end_at?: Date;

    @ApiProperty({
        example: 'Experience Information',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    info?: string;
}
