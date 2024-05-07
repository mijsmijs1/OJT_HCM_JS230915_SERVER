import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginAuthDTO } from './dtos/login-auth.dto';
import { RegisterAuthDTO } from './dtos/register-auth.dto';
import { SecureUtils } from 'src/shared/utils';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { token } from 'src/shared/utils/token';
import { Role } from 'src/constant/enum';
import { Candidate } from '../candidate/database/candidate.entity';
import { RequestToken } from 'src/shared/middleware/authen-jwr.middleware';
import { RedisService } from 'src/shared/utils/redis/redis';
import { MailService } from 'src/shared/utils/mail/mail.service';
import * as ejs from "ejs";
import * as path from 'path';
import { ChangePasswordDTO } from './dtos/change-password.dto';
import { UpdateCandidateDTO } from './dtos/update-account.dto';
import { CompanyService } from '../company/company.service';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService
  ) { }

  @Post('/login')
  async login(@Body() body: LoginAuthDTO, @Res() res: Response) {
    try {
      let result = await this.authService.findByEmail(body.email, body.role)
      if (!(result as any).email_status) {
        const now = Date.now();
        const lastEmailSentAt = JSON.parse(await this.redisService.redisClient.get(`lastEmailSentAt:${body.email}`))
        if (now - lastEmailSentAt < 60 * 1000) {
          throw new HttpException(this.i18n.t('err-message.errors.AlreadySentMail', { lang: I18nContext.current().lang }), HttpStatus.NOT_ACCEPTABLE, { cause: 'Already Sent Mail' })
        } else {
          if (Role[body.role] == Role.candidate) {
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
            ${process.env.API_URL}/auth/active-account-candidate?token=${token.createToken(result, String(60 * 60 * 1000))}
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
          } else {
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
            ${process.env.API_URL}/company/active-account-company?token=${token.createToken(result, String(60 * 60 * 1000))}
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
          }
          await this.redisService.redisClient.set(`lastEmailSentAt:${body.email}`, now);
          await this.redisService.redisClient.expire(`lastEmailSentAt:${body.email}`, 60);
          throw new HttpException(this.i18n.t('err-message.errors.NoActiveNotice', { lang: I18nContext.current().lang }), HttpStatus.NOT_ACCEPTABLE, { cause: 'No Active' })
        }


      }
      if (!(await SecureUtils.comparePasswords(body.password, result.password))) {
        throw new HttpException(this.i18n.t('err-message.errors.passwordIncorret', { lang: I18nContext.current().lang }), HttpStatus.UNAUTHORIZED, { cause: 'Unauthorized' })
      }
      if (Role[body.role] == Role.candidate) {
        if (!(result as Candidate).isOpen) {
          throw new HttpException(this.i18n.t('err-message.errors.lookedAccount', { lang: I18nContext.current().lang }), HttpStatus.FORBIDDEN, { cause: 'Forbidden' })
        }
      }
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.loginOk', { lang: I18nContext.current().lang }), accessToken: token.createToken(result), refreshToken: token.createRefreshToken(result) })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t('err-message.errors.serverError', { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Post('/register')
  async register(@Body() body: RegisterAuthDTO, @Res() res: Response) {
    try {
      let newCandidate = await this.authService.create(body)
      if (newCandidate) {
        const emailContent = await ejs.renderFile(path.join(__dirname, '../../../templates/send-mail.ejs'), {
          // Truyền các dữ liệu cần thiết cho file EJS nếu có
          title: "Account Activation",
          dear: `Dear ${body.name ? body.name : body.email
            }, `,
          content:
            `Thank you for creating an account with us. To activate your account and start using our services, please click on the following
          `,
          linkTitle: `Click here to activate your account:`
          ,
          linkURL: `
          ${process.env.API_URL}/auth/active-account-candidate?token=${token.createToken(newCandidate, String(60 * 60 * 1000))}
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
  @Post('/reset-password')
  async resetPassword(@Body() body: { email: string }, @Res() res: Response) {
    try {
      let result = await this.authService.findByEmail(body.email, 'all')
      if (result) {
        const emailContent = await ejs.renderFile(path.join(__dirname, '../../../templates/send-mail.ejs'), {
          // Truyền các dữ liệu cần thiết cho file EJS nếu có
          title: "Email khôi phục mật khẩu",
          dear: `Dear ${(result as any).name ? (result as any).name : (result).email
            }, `,
          content:
            `We received a request to reset the password for your account.If you did not request this, please disregard this email.
          `,
          linkTitle: `To reset your password, please click on the following link ,this link will expire in 5 minutes for security reasons:`
          ,
          linkURL: `
          ${process.env.API_URL}/auth/send-new-password?token=${token.createToken(result, String(5 * 60 * 1000))}&newPassword=${Math.floor(Date.now() * Math.random())}&role=${(result as any).name ? 'candidate' : 'company'} 
          `,
          linkContent: `
          Reset Your Password NOW!!!
          `
          ,
          senderName: "Ngụy Phú Quý"
        });
        this.mailService.sendMail(body.email, "[RIKKEI EDUCATION] Email khôi phục mật khẩu",
          emailContent
        )
      }
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.sendEmailSuccess', { lang: I18nContext.current().lang }) })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t('err-message.errors.serverError', { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Post('/change-password')
  async changePassword(@Req() req: RequestToken, @Body() body: ChangePasswordDTO, @Res() res: Response) {
    try {
      if (!await SecureUtils.comparePasswords(body.oldPassword, req.tokenData.password)) {
        throw new HttpException(this.i18n.t('err-message.errors.oldPasswordInvalid', { lang: I18nContext.current().lang }), HttpStatus.BAD_REQUEST, { cause: 'Bad Request' })
      }
      let result = await this.authService.update(req.tokenData.id, { password: await SecureUtils.hashPassword(body.newPassword) }, 'candidate')
      const token_key = `bl_${req.header('Authorization')?.replace('Bearer ', '')}`;
      await this.redisService.redisClient.set(token_key, req.header('Authorization')?.replace('Bearer ', ''));
      this.redisService.redisClient.expireAt(token_key, Number(req.tokenData.exp));
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.changePasswordOK', { lang: I18nContext.current().lang }) })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t('err-message.errors.serverError', { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Patch('/update-candidate-account')
  async updateAccount(@Req() req: RequestToken, @Body() body: UpdateCandidateDTO, @Res() res: Response) {
    try {
      let result = await this.authService.update(req.tokenData.id, body, "candidate")
      if (result) {
        let newCandidate = await this.authService.findById(req.tokenData.id, 'candidate')
        if (newCandidate) {
          const token_key = `bl_${req.header('Authorization')?.replace('Bearer ', '')}`;
          await this.redisService.redisClient.set(token_key, req.header('Authorization')?.replace('Bearer ', ''));
          this.redisService.redisClient.expireAt(token_key, Number(req.tokenData.exp));
          return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.updateAccountOK', { lang: I18nContext.current().lang }), data: { ...body, updated_at: newCandidate.updated_at }, accessToken: token.createToken(newCandidate), refreshToken: token.createRefreshToken(newCandidate) })
        }
      }
    } catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Post('/logout')
  async logout(@Req() req: RequestToken, @Body() body: { refreshToken: string }, @Res() res: Response) {
    try {
      const token_key = `bl_${req.header('Authorization')?.replace('Bearer ', '')}`;
      await this.redisService.redisClient.set(token_key, req.header('Authorization')?.replace('Bearer ', ''));
      this.redisService.redisClient.expireAt(token_key, Number(req.tokenData.exp));

      const refresh_token = `bl_refresh_${body.refreshToken}`
      await this.redisService.redisClient.set(refresh_token, body.refreshToken);
      let refreshTokenData = token.decodeRefreshToken(body.refreshToken);

      this.redisService.redisClient.expireAt(refresh_token, Number((refreshTokenData as any).exp));
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.LogoutOk', { lang: I18nContext.current().lang }) })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Get('/job-application/:jobId')
  async getJobApplications(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let result: any
      if (req.tokenData.name) {
        result = await this.authService.findJobApplicationsForCandidate(req.tokenData.id)
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.findJobApplicationOk', { lang: I18nContext.current().lang }), data: result })
      } else if (req.tokenData.companies && req.tokenData.companies.find(item => item.jobs.find(item => item.id == Number(req.params.jobId)))) {
        result = await this.authService.findJobApplicationsForCompany(Number(req.params.jobId))
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.findJobApplicationOk', { lang: I18nContext.current().lang }), data: result })
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

  @Post('/refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }, @Res() res: Response) {
    try {
      const inDenyList = await this.redisService.redisClient.get(`bl_refresh_${body.refreshToken}`);
      if (inDenyList) {
        console.log(1)
        throw new HttpException(this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), HttpStatus.UNAUTHORIZED, { cause: 'Unauthorized' })
      }
      let refreshTokenData = token.decodeRefreshToken(body.refreshToken);
      if (refreshTokenData) {
        let result = await this.authService.findByEmail((refreshTokenData as any).email, "all");
        if (!result) {
          console.log(2)
          throw new HttpException(this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), HttpStatus.UNAUTHORIZED, { cause: 'Unauthorized' })

        }
        if ((refreshTokenData as any).updateAt != (result as any).updateAt) {
          console.log(3)
          throw new HttpException(this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), HttpStatus.UNAUTHORIZED, { cause: 'Unauthorized' })

        }
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.refreshTokenOk', { lang: I18nContext.current().lang }), accessToken: token.createToken(result) })
      }
      console.log(4)
      throw new HttpException(this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), HttpStatus.UNAUTHORIZED, { cause: 'Unauthorized' })
    } catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Get('/send-new-password')
  async sendNewPassword(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let result = await this.authService.update(Number(req.tokenData.id), { password: await SecureUtils.hashPassword(String(req.query.newPassword)) }, String(req.query.role))
      if (result) {
        return res.status(HttpStatus.OK).send(`Your new password is: "${req.query.newPassword}"`)
      }
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

  @Get('/active-account-candidate')
  async RegisterAccount(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let result = await this.authService.update((req.tokenData as any).id, { email_status: true }, "candidate")
      // let message = await i18n.t('success-message.auth.registerOk')
      if (result) {
        return res.status(HttpStatus.OK).send(`You have successfully actived an account with the email: ${(req.tokenData as any).email}`)
      }
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Get('/check-token')
  async checkToken(@Req() req: RequestToken, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.decodeTokenOK', { lang: I18nContext.current().lang }), data: { ...req.tokenData, role: req.tokenData.name ? "candidate" : "company" } })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Delete('delete-account')
  async deleteAccount(@Req() req: RequestToken, @Body() body: { email: string, role: string }, @Res() res: Response) {
    try {
      if (req.tokenData.email != body.email) {
        throw new HttpException(this.i18n.t('err-message.errors.NotFound', { lang: I18nContext.current().lang }), HttpStatus.UNAUTHORIZED, { cause: 'Not Found' })
      }
      // let result = await this.authService.delete(req.tokenData.id, body.role)
      await this.authService.update(req.tokenData.id, { isOpen: 0 }, 'candidate');
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.deleteAccountOK', { lang: I18nContext.current().lang }) })
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
}
