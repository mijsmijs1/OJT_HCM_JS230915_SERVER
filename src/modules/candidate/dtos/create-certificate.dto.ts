import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateCertificateCandidateDTO {
    @ApiProperty({
        example: 'Certificate Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    name: string;

    @ApiProperty({
        example: 'Organization Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    organization: string;

    @ApiProperty({
        example: '2023-01-01',
        required: false,
    })
    @Type(() => Date)
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    started_at: Date;

    @ApiProperty({
        example: '2023-12-31',
        required: false,
    })
    @Type(() => Date)
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    end_at: Date;

    @ApiProperty({
        example: 'Certificate Information',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @Type(() => Date)
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    info: string;
}
