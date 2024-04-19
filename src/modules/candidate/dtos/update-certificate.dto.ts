import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class UpdateCertificateCandidateDTO {
    @ApiProperty({
        example: 'Certificate Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'Organization Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    organization?: string;

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
        example: 'Certificate Information',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    info?: string;
}
