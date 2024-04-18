import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsInt, IsString } from "class-validator";

export class CreateJobsCandidatesDto {
    @ApiProperty({
        example: 'https://example.com/cv',
        description: 'URL of the candidate\'s CV',
        required: true,
    })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    @IsString({ message: 'validation.COMMON_ERROR' })
    cv_url: string;

    @ApiProperty({
        example: 'Some content about the application',
        description: 'Content related to the job application',
        required: true,
    })
    @IsNotEmpty({ message: 'Content must not be empty' })
    @IsString({ message: 'validation.COMMON_ERROR' })
    content: string;

    @ApiProperty({
        example: 1,
        description: 'ID of the job the candidate is applying for',
        required: true,
    })
    @IsNotEmpty({ message: 'Job ID must not be empty' })
    @IsInt({ message: 'validation.COMMON_ERROR' })
    job_id: number;

    // @ApiProperty({
    //     example: 1,
    //     description: 'ID of the candidate applying for the job',
    //     required: true,
    // })
    // @IsNotEmpty({ message: 'Candidate ID must not be empty' })
    // @IsInt({ message: 'validation.COMMON_ERROR' })
    // candidate_id: number;
}
