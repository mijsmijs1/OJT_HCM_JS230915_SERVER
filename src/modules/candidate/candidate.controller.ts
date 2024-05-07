import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { RedisService } from 'src/shared/utils/redis/redis';
import { MailService } from 'src/shared/utils/mail/mail.service';
import { RequestToken } from 'src/shared/middleware/authen-jwr.middleware';
import { CreateCertificateCandidateDTO } from './dtos/create-certificate.dto';
import { Request, Response } from 'express';
import { CreateEducationCandidateDTO } from './dtos/create-education.dto';
import { CreateExperienceCandidateDTO } from './dtos/create-experience.dto';
import { CreateProjectCandidateDTO } from './dtos/create-project.dto';
import { CreateSkillsCandidateDTO } from './dtos/create-skill.dto';
import { UpdateCertificateCandidateDTO } from './dtos/update-certificate.dto';
import { UpdateEducationCandidateDTO } from './dtos/update-education.dto';
import { UpdateExperienceCandidateDTO } from './dtos/update-experience.dto';
import { UpdateProjectCandidateDTO } from './dtos/update-project.dto';
import { UpdateSkillsCandidateDTO } from './dtos/update-skill.dto';
import { CreateJobsCandidatesDto } from './dtos/create-job-application.dto';

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

  @Post('/create-job-application')
  async createApplication(@Req() req: RequestToken, @Body() body: CreateJobsCandidatesDto, @Res() res: Response) {
    try {
      let result = await this.candidateService.createJobApplication({ ...body, candidate_id: Number(req.tokenData.id) })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.ApplyJobOk', { lang: I18nContext.current().lang }), data: { ...result } })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

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

      if (req.tokenData.certificates.find(item => item.id == Number(req.params.id))) {
        let result = await this.candidateService.updateCertificate(Number(req.params.id), { ...body })
        if (result) {
          return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.updateCertificate', { lang: I18nContext.current().lang }), data: { ...result } })
        }
      }
      throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
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
      if (req.tokenData.education.find(item => item.id == Number(req.params.id))) {
        let result = await this.candidateService.updateEducation(Number(req.params.id), { ...body })
        if (result) {
          return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.updateEducation', { lang: I18nContext.current().lang }), data: { ...result } })
        }
      }
      throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
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
      if (req.tokenData.experience.find(item => item.id == Number(req.params.id))) {
        let result = await this.candidateService.updateExperience(Number(req.params.id), { ...body })
        if (result) {
          return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.updateExperience', { lang: I18nContext.current().lang }), data: { ...result } })
        }
      }
      throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
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
      if (req.tokenData.projects.find(item => item.id == Number(req.params.id))) {
        let result = await this.candidateService.updateProject(Number(req.params.id), { ...body })
        if (result) {
          return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.updateProject', { lang: I18nContext.current().lang }), data: { ...result } })
        }
      }
      throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
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
      if (req.tokenData.skills.find(item => item.id == Number(req.params.id))) {
        let result = await this.candidateService.updateSkill(Number(req.params.id), { ...body })
        if (result) {
          return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.updateSkill', { lang: I18nContext.current().lang }), data: { ...result } })
        }
      }
      throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Get('/skill')
  async getSkill(@Res() res: Response) {
    try {
      let result = await this.candidateService.getSkill()
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

  @Get('/certificate')
  async getCertificate(@Res() res: Response) {
    try {
      let result = await this.candidateService.getCertificate()
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

  @Get('/experience')
  async getExperience(@Res() res: Response) {
    try {
      let result = await this.candidateService.getExperience()
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

  @Get('/project')
  async getProject(@Res() res: Response) {
    try {
      let result = await this.candidateService.getProject()
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

  @Get('/education')
  async getEducation(@Res() res: Response) {
    try {
      let result = await this.candidateService.getEducation()
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

  @Get('/skill/:candidateId')
  async getSkillById(@Req() req: Request, @Res() res: Response) {
    try {
      let result = await this.candidateService.getSkillById(Number(req.params.candidateId))
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

  @Get('/certificate/:candidateId')
  async getCertificateById(@Req() req: Request, @Res() res: Response) {
    try {
      let result = await this.candidateService.getCertificateById(Number(req.params.candidateId))
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

  @Get('/experience/:candidateId')
  async getExperienceById(@Req() req: Request, @Res() res: Response) {
    try {
      let result = await this.candidateService.getExperienceById(Number(req.params.candidateId))
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

  @Get('/project/:candidateId')
  async getProjectById(@Req() req: Request, @Res() res: Response) {
    try {
      let result = await this.candidateService.getProjectById(Number(req.params.candidateId))
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

  @Get('/education/:candidateId')
  async getEducationById(@Req() req: Request, @Res() res: Response) {
    try {
      let result = await this.candidateService.getEducationById(Number(req.params.candidateId))
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

  @Get('/get-applied-job')
  async getAppliedJob(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let result = await this.candidateService.getAppliedJob(Number(req.tokenData.id), req.query.page ? Number(req.query.page) : 1, req.query.pageSize ? Number(req.query.pageSize) : 9)
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.GetAplliedJobOk', { lang: I18nContext.current().lang }), data: result })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Get('/get-applied-candidate/:jobId/get')
  async getAppliedCandidate(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let result = await this.candidateService.getAppliedCandidate(Number(req.params.jobId), req.query.page ? Number(req.query.page) : 1, req.query.pageSize ? Number(req.query.pageSize) : 9)
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.GetAplliedCandidateOk', { lang: I18nContext.current().lang }), data: result })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Get('/get-CV')
  async getCV(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let result = await this.candidateService.getCV(Number(req.query.candidateId), Number(req.query.jobId))
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.GetCVOk', { lang: I18nContext.current().lang }), data: result })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Get('/get-candidate-by-id/:candidateId')
  async getCandidateById(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let result = await this.candidateService.getById(Number(req.params.candidateId))
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.GetCandidateOk', { lang: I18nContext.current().lang }), data: result })
      }
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Delete('/delete-education/:id')
  async deleteEducation(@Req() req: RequestToken, @Res() res: Response) {
    try {
      if (req.tokenData.education.find(item => item.id == Number(req.params.id))) {
        let result = await this.candidateService.deleteEducation(Number(req.params.id))
        if (result) {
          return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.deleteEducation', { lang: I18nContext.current().lang }) })
        }
      }
      throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
    }
    catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

}
