import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSkillsCandidateDTO {
    @ApiProperty({
        example: 'Skill Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
     @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    name: string;

    @ApiProperty({
        example: 'Level Job ID',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
     @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    level_job_id: string;
}
