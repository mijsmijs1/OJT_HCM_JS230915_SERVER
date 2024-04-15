import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
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


@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
    private readonly redisService: RedisService
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
  @Get('logout')
  async logout(@Req() req: RequestToken, @Body() body: { refreshToken: string }, @Res() res: Response) {
    try {
      const token_key = `bl_${req.header('Authorizarion')?.replace('Bearer ', '')}`;
      await this.redisService.redisClient.set(token_key, req.header('Authorizarion')?.replace('Bearer ', ''));
      this.redisService.redisClient.expireAt(token_key, req.tokenData.exp);
      const refresh_token = `bl_refresh_${body.refreshToken}`
      await this.redisService.redisClient.set(refresh_token, body.refreshToken);
      let refreshTokenData = token.decodeRefreshToken(body.refreshToken);
      this.redisService.redisClient.expireAt(refresh_token, (refreshTokenData as any).exp);
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.LogoutOk', { lang: I18nContext.current().lang }) })
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Get('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }, @Res() res: Response) {
    try {
      const inDenyList = await this.redisService.redisClient.get(`bl_refresh_${body.refreshToken}`);
      if (inDenyList) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
      }
      let refreshTokenData = token.decodeRefreshToken(body.refreshToken);
      if (refreshTokenData) {
        let result = this.authService.findByEmail((refreshTokenData as any).email, "candidate");
        if (!result) {
          result = this.authService.findByEmail((refreshTokenData as any).email, "company");
          if (!result) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
          }
        }
        if ((refreshTokenData as any).updateAt != (result as any).updateAt) {
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
        }
        return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.refreshTokenOk', { lang: I18nContext.current().lang }), accessToken: token.createToken(result) })
      }
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
}
