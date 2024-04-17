import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateSkillsCandidateDTO {
    @ApiProperty({
        example: 'Skill Name',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'Level Job ID',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    level_job_id?: string;
}
