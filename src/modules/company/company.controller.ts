import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { CompanyService } from './company.service';
import { RegisterCompanyDTO } from './dtos/register-company.dto';
import { Request, Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CreateCompanyDTO } from './dtos/create-company.dto';
import { RequestToken } from 'src/shared/middleware/authen-jwr.middleware';
import { CreateAddressDTO } from './dtos/create-address.dto';
import { UpdateCompanyDTO } from './dtos/update-company.dto';
import { UpdateAddressDTO } from './dtos/update-address.dto';
import { Status } from 'src/constant/enum';
import { AuthService } from '../auth/auth.service';
import * as ejs from "ejs";
import * as path from 'path';
import { token } from 'src/shared/utils/token';
import { MailService } from 'src/shared/utils/mail/mail.service';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly i18n: I18nService,
  ) { }
  @Post('/register')
  async register(@Body() body: RegisterCompanyDTO, @Res() res: Response) {
    try {
      // let checkEmail = this.authService.findByEmail(body.email, 'all')
      // if (checkEmail) {
      //   throw new HttpException(this.i18n.t('err-message.errors.existingRegisterInfo', { lang: I18nContext.current().lang }), HttpStatus.CONFLICT, { cause: "Conflict" })
      // }
      let newCompany = await this.companyService.create(body)
      if (newCompany) {
        const emailContent = await ejs.renderFile(path.join(__dirname, '../../../templates/send-mail.ejs'), {
          // Truyền các dữ liệu cần thiết cho file EJS nếu có
          title: "Account Activation",
          dear: `Dear ${body.email
            }, `,
          content:
            `Thank you for creating an account with us. To activate your account and start using our services, please click on the following
          `,
          linkTitle: `Click here to activate your account:`
          ,
          linkURL: `
          ${process.env.API_URL}/company/active-account-company?token=${token.createToken(newCompany, String(60 * 60 * 1000))} 
          `,
          linkContent: `
          Activate Your Account NOW!!!
          `
          ,
          senderName: "Ngụy Phú Quý"
        });
        this.mailService.sendMail(body.email, "[RIKKEI EDUCATION] Account Activation Email",
          emailContent
        )
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.sendActiveEmailSuccess', { lang: I18nContext.current().lang }) })
      }

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
  @Get('/active-account-company')
  async RegisterAccount(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let result = await this.authService.update((req.tokenData as any).id, { email_status: true }, "company")
      // let message = await i18n.t('success-message.auth.registerOk')
      if (result) {
        return res.status(HttpStatus.OK).send(`You have successfully created a business account with the email: ${(req.tokenData as any).email}`)
      }
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
