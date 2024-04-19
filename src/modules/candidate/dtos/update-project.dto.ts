import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateProjectCandidateDTO {
    @ApiProperty({
        example: 'Project Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'https://github.com/yourproject',
        required: false,
    })
    @IsUrl({}, { message: 'validation.COMMON_ERROR' })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    link?: string;

    @ApiProperty({
        example: '2023-01-01',
        required: false,
    })
    @Type(() => Date)
    @IsOptional()
    started_at?: Date;

    @ApiProperty({
        example: '2023-12-31',
        required: false,
    })
    @Type(() => Date)
    @IsOptional()
    end_at?: Date;

    @ApiProperty({
        example: 'Project Information',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    info?: string;
}
