import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { CompanyService } from './company.service';
import { RegisterCompanyDTO } from './dtos/register-company.dto';
import { Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CreateCompanyDTO } from './dtos/create-company.dto';
import { RequestToken } from 'src/shared/middleware/authen-jwr.middleware';
import { CreateAddressDTO } from './dtos/create-address.dto';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly i18n: I18nService,
  ) { }
  @Post('/register')
  async register(@Body() body: RegisterCompanyDTO, @Res() res: Response) {
    try {
      await this.companyService.create({
        email: body.email,
        password: body.password
      })
      // let message = await i18n.t('success-message.auth.registerOk')
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.registerOk', { lang: I18nContext.current().lang }) })
    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Post('/create-company')
  async createCompany(@Req() req: RequestToken, @Body() body: CreateCompanyDTO, @Res() res: Response) {
    try {
      await this.companyService.createCompany({
        ...body,
        account_company_id: req.tokenData.id
      })
      // let message = await i18n.t('success-message.auth.registerOk')
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.company.createCompany', { lang: I18nContext.current().lang }) })
    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Post('/create-address/:companyId')
  async createAddress(@Req() req: RequestToken, @Body() body: CreateAddressDTO, @Res() res: Response) {
    try {
      let result = await this.companyService.findCompanyByIdFromAccountId(req.tokenData.id, Number(req.params.companyId))
      if (result) {
        await this.companyService.createAddress(Number(req.params.companyId), {
          ...body,
          account_company_id: req.tokenData.id
        })
        // let message = await i18n.t('success-message.auth.registerOk')
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.company.createCompany', { lang: I18nContext.current().lang }) })
      }
    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  // @Get('/search')
  // async getBySearch(@Req() req: RequestToken, @Res() res: Response) {
  //   try {
  //     console.log(req.query.keyword, typeof req.query.keyword)
  //     let result = await this.companyService.getSearch(Number(req.query.page), Number(req.query.pageSize) ? Number(req.query.pageSize) : 20, req.query.keyword ? String(req.query.keyword) : "all", req.query.address ? String(req.query.address) : "all")
  //     return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.company.getCompanyOK', { lang: I18nContext.current().lang }), data: result })
  //   } catch (err) {
  //     console.log(err)
  //     if (err instanceof HttpException) {
  //       return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
  //     }
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
  //   }
  // }

  @Get('/:companyId')
  async getOneCompany(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let result = await this.companyService.getById(Number(req.params.companyId))
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.company.getCompanyOK', { lang: I18nContext.current().lang }), data: result })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
}
