import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateEducationCandidateDTO {
    @ApiProperty({
        example: 'Education Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
     @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    name_education: string;

    @ApiProperty({
        example: 'Major',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
     @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    major: string;

    @ApiProperty({
        example: '1990-01-01',
        required: false,
    })
    @IsDate({ message: 'validation.COMMON_ERROR' })
     @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    started_at: Date;

    @ApiProperty({
        example: '1995-01-01',
        required: false,
    })
    @IsDate({ message: 'validation.COMMON_ERROR' })
     @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    end_at: Date;

    @ApiProperty({
        example: 'Additional Info',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
     @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    info: string;
}
