import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { CompanyService } from './company.service';
import { RegisterCompanyDTO } from './dtos/register-company.dto';
import { Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CreateCompanyDTO } from './dtos/create-company.dto';
import { RequestToken } from 'src/shared/middleware/authen-jwr.middleware';
import { CreateAddressDTO } from './dtos/create-address.dto';
import { UpdateCompanyDTO } from './dtos/update-company.dto';
import { UpdateAddressDTO } from './dtos/update-address.dto';
import { Status } from 'src/constant/enum';

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
      if (req.tokenData.companies.find(item => item.id == Number(req.params.companyId))) {
        await this.companyService.createAddress(Number(req.params.companyId), {
          ...body,
          account_company_id: req.tokenData.id
        })
        // let message = await i18n.t('success-message.auth.registerOk')
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.company.createCompany', { lang: I18nContext.current().lang }) })
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

  @Patch('/update-company/:companyId')
  async updateCompany(@Req() req: RequestToken, @Body() body: UpdateCompanyDTO, @Res() res: Response) {
    try {
      if (req.tokenData.companies.find(item => item.id == Number(req.params.companyId))) {
        let result = await this.companyService.update(Number(req.params.companyId),
          {
            ...body
          })
        if (result) {
          return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.company.updateCompanyOK', { lang: I18nContext.current().lang }), data: result })
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

  @Patch('/update-address')
  async updateAddress(@Req() req: RequestToken, @Body() body: UpdateAddressDTO, @Res() res: Response) {
    try {
      if (req.tokenData.companies.find(item => item.id == Number(req.params.companyId)).address_companies.find(item => item.id == Number(req.query.addressId))) {
        let result = await this.companyService.updateAddress(Number(req.query.addressId), body)
        if (result) {
          return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.company.updateCompanyOK', { lang: I18nContext.current().lang }), data: result })
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
      let result = await this.companyService.getSearch(Number(req.query.page), Number(req.query.pageSize) ? Number(req.query.pageSize) : 20, req.query.keyword ? String(req.query.keyword) : "all", req.query.address ? String(req.query.address) : "all")
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.company.getCompanyOK', { lang: I18nContext.current().lang }), data: result })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Get('/address')
  async GetAdress(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let result = await this.companyService.getAddress()
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.company.getAddressOK', { lang: I18nContext.current().lang }), data: result })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

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
