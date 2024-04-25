import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, Res, Delete } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { RedisService } from 'src/shared/utils/redis/redis';
import { Response } from 'express';
import { token } from 'src/shared/utils/token';
import { MailService } from 'src/shared/utils/mail/mail.service';
import { RequestToken } from 'src/shared/middleware/authen-jwr.middleware';
import { CreateApplicationDTO } from './dtos/create-application.dto';
import { updateApplicationDTO } from './dtos/update-application.dto';
@ApiTags('Application')
@ApiBearerAuth()
@Controller('application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly i18n: I18nService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService
  ) { }
  @Post('create-application')
  async createApplication(@Body() body: CreateApplicationDTO, @Res() res: Response) {
    try {
      const result = await this.applicationService.createApplication({
        nameJob: body.nameJob,
        // jobDescription: body.jobDescription,
        jobDetail: body.jobDetail,
        company: body.company,
        salaryMin: body.salaryMin,
        salaryMax: body.salaryMax,
        applicationEnd: body.applicationEnd,
      })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.createCertificate', { lang: I18nContext.current().lang }), data: { ...result } })
      }
    } catch (error) {
      console.log("lỗi tạo application", error);

      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Get('all-applications')
  async getAllApplications(@Res() res: Response) {
    try {
      const applications = await this.applicationService.findAllApplications();
      return res.status(HttpStatus.OK).json(applications);
    } catch (error) {
      console.log("Error while getting all applications:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch applications',
        error: 'InternalServerError'
      });
    }
  }
  @Patch('/update-application/:id')
  async updateApplication(@Req() req: RequestToken, @Body() body: updateApplicationDTO, @Res() res: Response) {
    try {
      let result = await this.applicationService.updateApplication(Number(req.params.id), { ...body })
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.candidate.updateProject', { lang: I18nContext.current().lang }), data: { ...result } })
      }
      throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Delete('remove/:id')
  async deleteApplication(@Req() req, @Res() res: Response) {
    try {
      const id = Number(req.params.id); // Lấy id từ tham số URL
      // Gọi phương thức xóa từ service
      await this.applicationService.DeleteApllication(id);

      // Trả về kết quả thành công
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.deleteApplication', { lang: I18nContext.current().lang }) });
    } catch (error) {
      // Xử lý lỗi
      console.log("lỗi controller del", error);

      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' });
    }
  }
}
