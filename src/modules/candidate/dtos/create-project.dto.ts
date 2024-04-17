import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateProjectCandidateDTO {
    @ApiProperty({
        example: 'Project Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
     @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    name: string;

    @ApiProperty({
        example: 'https://github.com/yourproject',
        required: false,
    })
    @IsUrl({}, { message: 'validation.COMMON_ERROR' })
    @IsString({ message: 'validation.COMMON_ERROR' })
     @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    link: string;

    @ApiProperty({
        example: '2023-01-01',
        required: false,
    })
    @IsDate({ message: 'validation.COMMON_ERROR' })
     @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    started_at: Date;

    @ApiProperty({
        example: '2023-12-31',
        required: false,
    })
    @IsDate({ message: 'validation.COMMON_ERROR' })
     @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    end_at: Date;

    @ApiProperty({
        example: 'Project Information',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
     @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    info: string;
}
