import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
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
      if (!(await SecureUtils.comparePasswords(body.password, result.password))) {
        throw new HttpException(this.i18n.t('err-message.errors.passwordIncorret', { lang: I18nContext.current().lang }), HttpStatus.UNAUTHORIZED, { cause: 'Unauthorized' })
      }
      if (body.role == String(Role.candidate)) {
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
      await this.authService.create({
        name: body.name,
        email: body.email,
        password: await SecureUtils.hashPassword(body.password) as string
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
      console.log(req.tokenData)
      if (SecureUtils.comparePasswords(body.oldPassword, req.tokenData.password)) {
        throw new HttpException(this.i18n.t('err-message.errors.oldPasswordInvalid', { lang: I18nContext.current().lang }), HttpStatus.BAD_REQUEST, { cause: 'Bad Request' })
      }
      let result = await this.authService.update(req.tokenData.id, { password: body.newPassword }, 'all')
      if (result) {
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.changePasswordOK', { lang: I18nContext.current().lang }) })
      }
    } catch (err) {
      console.log(err)
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t('err-message.errors.serverError', { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Patch('update-candidate-account')
  async updateAccount(@Req() req: RequestToken, @Body() body: UpdateCandidateDTO, @Res() res: Response) {
    try {
      let result = await this.authService.update(req.tokenData.id, body, "candidate")
      if (result) {
        let newCandidate = await this.authService.findById(req.tokenData.id, 'candidate')
        if (newCandidate) {
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
  @Get('/logout')
  async logout(@Req() req: RequestToken, @Body() body: { refreshToken: string }, @Res() res: Response) {
    try {
      const token_key = `bl_${req.header('Authorizarion')?.replace('Bearer ', '')} `;
      await this.redisService.redisClient.set(token_key, req.header('Authorizarion')?.replace('Bearer ', ''));
      this.redisService.redisClient.expireAt(token_key, req.tokenData.exp);
      const refresh_token = `bl_refresh_${body.refreshToken} `
      await this.redisService.redisClient.set(refresh_token, body.refreshToken);
      let refreshTokenData = token.decodeRefreshToken(body.refreshToken);
      this.redisService.redisClient.expireAt(refresh_token, (refreshTokenData as any).exp);
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.LogoutOk', { lang: I18nContext.current().lang }) })
    } catch (err) {
      if (err instanceof HttpException) {
        return res.status(err.getStatus()).json({ message: err.getResponse().toString(), error: err.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Get('/refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }, @Res() res: Response) {
    try {
      const inDenyList = await this.redisService.redisClient.get(`bl_refresh_${body.refreshToken} `);
      if (inDenyList) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
      }
      let refreshTokenData = token.decodeRefreshToken(body.refreshToken);
      if (refreshTokenData) {
        let result = this.authService.findByEmail((refreshTokenData as any).email, "all");
        if (!result) {
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
        }
        if ((refreshTokenData as any).updateAt != (result as any).updateAt) {
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
        }
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.refreshTokenOk', { lang: I18nContext.current().lang }), accessToken: token.createToken(result) })
      }
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
}
