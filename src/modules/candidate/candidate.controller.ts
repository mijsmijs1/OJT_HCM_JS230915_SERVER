import { Body, Controller, HttpException, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { RedisService } from 'src/shared/utils/redis/redis';
import { MailService } from 'src/shared/utils/mail/mail.service';
import { RequestToken } from 'src/shared/middleware/authen-jwr.middleware';
import { CreateCertificateCandidateDTO } from './dtos/create-certificate.dto';
import { Response } from 'express';
import { CreateEducationCandidateDTO } from './dtos/create-education.dto';
import { CreateExperienceCandidateDTO } from './dtos/create-experience.dto';
import { CreateProjectCandidateDTO } from './dtos/create-project.dto';
import { CreateSkillsCandidateDTO } from './dtos/create-skill.dto';
import { UpdateCertificateCandidateDTO } from './dtos/update-certificate.dto';
import { UpdateEducationCandidateDTO } from './dtos/update-education.dto';
import { UpdateExperienceCandidateDTO } from './dtos/update-experience.dto';
import { UpdateProjectCandidateDTO } from './dtos/update-project.dto';
import { UpdateSkillsCandidateDTO } from './dtos/update-skill.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('candidate')
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly i18n: I18nService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService
  ) { }
  @Post('/create-certificate')
  async createCertificate(@Req() req: RequestToken, @Body() body: CreateCertificateCandidateDTO, @Res() res: Response) {
    try {
      let result = await this.candidateService.createCertificate({ ...body, candidate_id: Number(req.tokenData.id) })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.createCertificate', { lang: I18nContext.current().lang }), data: { ...result } })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Post('/create-education')
  async createEducation(@Req() req: RequestToken, @Body() body: CreateEducationCandidateDTO, @Res() res: Response) {
    try {
      let result = await this.candidateService.createEducation({ ...body, candidate_id: Number(req.tokenData.id) })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.createEducation', { lang: I18nContext.current().lang }), data: { ...result } })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Post('/create-experience')
  async createExperience(@Req() req: RequestToken, @Body() body: CreateExperienceCandidateDTO, @Res() res: Response) {
    try {
      let result = await this.candidateService.createExperience({ ...body, candidate_id: Number(req.tokenData.id) })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.createExperience', { lang: I18nContext.current().lang }), data: { ...result } })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Post('/create-project')
  async createProject(@Req() req: RequestToken, @Body() body: CreateProjectCandidateDTO, @Res() res: Response) {
    try {
      let result = await this.candidateService.createProject({ ...body, candidate_id: Number(req.tokenData.id) })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.createProject', { lang: I18nContext.current().lang }), data: { ...result } })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Post('/create-skill')
  async createSkill(@Req() req: RequestToken, @Body() body: CreateSkillsCandidateDTO, @Res() res: Response) {
    try {
      let result = await this.candidateService.createSkill({ ...body, candidate_id: Number(req.tokenData.id) })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.createSkill', { lang: I18nContext.current().lang }), data: { ...result } })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Patch('/update-certificate/:id')
  async updateCertificate(@Req() req: RequestToken, @Body() body: UpdateCertificateCandidateDTO, @Res() res: Response) {
    try {
      let result = await this.candidateService.updateCertificate(Number(req.params.id), { ...body })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.updateCertificate', { lang: I18nContext.current().lang }), data: { ...result } })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Patch('/update-education/:id')
  async updateEducation(@Req() req: RequestToken, @Body() body: UpdateEducationCandidateDTO, @Res() res: Response) {
    try {
      let result = await this.candidateService.updateEducation(Number(req.params.id), { ...body })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.updateEducation', { lang: I18nContext.current().lang }), data: { ...result } })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Patch('/update-experience/:id')
  async updateExperience(@Req() req: RequestToken, @Body() body: UpdateExperienceCandidateDTO, @Res() res: Response) {
    try {
      let result = await this.candidateService.updateExperience(Number(req.params.id), { ...body })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.updateExperience', { lang: I18nContext.current().lang }), data: { ...result } })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Patch('/update-project/:id')
  async updateProject(@Req() req: RequestToken, @Body() body: UpdateProjectCandidateDTO, @Res() res: Response) {
    try {
      let result = await this.candidateService.updateProject(Number(req.params.id), { ...body })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.updateProject', { lang: I18nContext.current().lang }), data: { ...result } })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Patch('/update-skill/:id')
  async updateSkill(@Req() req: RequestToken, @Body() body: UpdateSkillsCandidateDTO, @Res() res: Response) {
    try {
      let result = await this.candidateService.updateSkill(Number(req.params.id), { ...body })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.updateSkill', { lang: I18nContext.current().lang }), data: { ...result } })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

}
