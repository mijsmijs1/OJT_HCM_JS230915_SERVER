import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { JobService } from './job.service';
import { RequestToken } from 'src/shared/middleware/authen-jwr.middleware';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Response } from 'express';
import { CreateJobDto } from './dtos/create-job.dto';
import { UpdateJobDto } from './dtos/update-job.dto';

@Controller('job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly i18n: I18nService
  ) { }
  @Post('/create-job')
  async createJob(@Req() req: RequestToken, @Body() body: CreateJobDto, @Res() res: Response) {
    try {
      if (req.tokenData.companies.find(item => item.id == Number(body.company_id))) {
        await this.jobService.create(Number(body.company_id), {
          ...body,
        })
        // let message = await i18n.t('success-message.auth.registerOk')
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.job.createJob', { lang: I18nContext.current().lang }) })
      }
      throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Patch('/update-job/:jobId')
  async updateJob(@Req() req: RequestToken, @Body() body: UpdateJobDto, @Res() res: Response) {
    try {
      if (req.tokenData.companies.find(item => item.id == Number(body.company_id)).jobs.find(item => item.id == Number(req.params.jobId))) {
        let result = await this.jobService.update(Number(req.params.jobId), body)
        if (result) {
          return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.job.updateJobOK', { lang: I18nContext.current().lang }), data: result })
        }
      }
      throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.NOT_FOUND, { cause: "Not Found" })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Get('/search')
  async getBySearch(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let idArray = [];
      if (Array.isArray(req.query.typeJobId)) {
        // Chuyển đổi mỗi phần tử trong mảng idParams thành số (number)
        idArray = req.query.typeJobId.map(id => parseInt(id, 10));

        // Bây giờ idArray sẽ là một mảng các số (numbers)
      } else if (req.query.typeJobId) {
        // Trường hợp chỉ có một giá trị id được truyền (không phải mảng)
        // Chuyển giá trị id thành một mảng gồm một phần tử
        idArray = [parseInt(String(req.query.typeJobId), 10)];
      }
      let result = await this.jobService.getSearch(req.query.page ? Number(req.query.page) : 1, req.query.pageSize ? Number(req.query.pageSize) : 20, req.query.keyword ? String(req.query.keyword) : "all", req.query.address ? String(req.query.address) : "all", idArray)
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.job.getJobOK', { lang: I18nContext.current().lang }), data: result })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Get('/type-job')
  async getTypeJob(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let result = await this.jobService.gettypeJob()
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.job.getTypeJobOK', { lang: I18nContext.current().lang }), data: result })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Get('/:jobId')
  async getOneCompany(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let result = await this.jobService.getById(Number(req.params.jobId))
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.job.getJobOK', { lang: I18nContext.current().lang }), data: result })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

}