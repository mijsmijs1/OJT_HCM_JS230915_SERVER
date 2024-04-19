import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateExperienceCandidateDTO {
    @ApiProperty({
        example: 'Position Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    position: string;

    @ApiProperty({
        example: 'Company Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    company: string;

    @ApiProperty({
        example: '2020-01-01',
        required: false,
    })
    @Type(() => Date)
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    started_at: Date;

    @ApiProperty({
        example: '2022-12-31',
        required: false,
    })
    @Type(() => Date)
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    end_at: Date;

    @ApiProperty({
        example: 'Experience Information',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    info: string;
}
