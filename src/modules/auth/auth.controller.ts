import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginAuthDTO } from './dtos/login-auth.dto';
import { RegisterAuthDTO } from './dtos/register-auth.dto';
import { SecureUtils } from 'src/shared/utils';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { token } from 'src/shared/utils/token';
import { Role } from 'src/constant/enum';
import { Candidate } from '../candidate/database/candidate .entity';


@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService) { }

  @Post('/login')
  async login(@Req() req: Request, @Body() body: LoginAuthDTO, @Res() res: Response) {
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
  async register(@Req() req: Request, @Body() body: RegisterAuthDTO, @Res() res: Response) {
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

}
