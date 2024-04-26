import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { MailService } from 'src/shared/utils/mail/mail.service';
import { Response } from 'express';
import { RedisService } from 'src/shared/utils/redis/redis';
import { Admin } from './database/admin.entity';
import { LoginAdminDTO } from './dtos/login-admin.dto';
import { RegisterAdminDTO } from './dtos/register-admin.dto';
import { token } from 'src/shared/utils/token';
import { RequestToken } from 'src/shared/middleware/admin-jwr.middleware';
import { SecureUtils } from 'src/shared/utils';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as ejs from "ejs";
import * as path from 'path';
import { Application } from '../application/database/application.entity';
@ApiBearerAuth()
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly i18n: I18nService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
  ) { }
  @Post('/register')
  async register(@Body() body: RegisterAdminDTO, @Res() res: Response) {
    try {
      await this.adminService.register({
        name: body.name,
        email: body.email,
        password: body.password
      })
      return res.status(HttpStatus.OK).json({
        message: this.i18n.t('success-message.auth.registerOk', { lang: I18nContext.current().lang })
      })

    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Post('/login')
  async login(@Body() body: LoginAdminDTO, @Res() res: Response) {
    try {
      let login = await this.adminService.findByEmail(body.email)
      if (!(await SecureUtils.comparePasswords(body.password, login.password))) {
        throw new HttpException(this.i18n.t('err-message.errors.passwordIncorret', { lang: I18nContext.current().lang }), HttpStatus.UNAUTHORIZED, { cause: 'Unauthorized' })
      }
      if (!(login.isAdmin == 1 || login.isAdmin == undefined)) {
        throw new HttpException(
          this.i18n.t('err-message.errors.NotAdmin', { lang: I18nContext.current().lang }),
          HttpStatus.UNAUTHORIZED,
          { cause: 'UNAUTHORIZED' }
        );
      }
      return res.status(HttpStatus.OK).json({
        message: this.i18n.t('success-message.auth.loginOk', { lang: I18nContext.current().lang }), accessToken: token.createToken(login), refeshToken: token.createRefreshToken(login)
      })
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t('err-message.errors.serverError', { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  // @Get('/logout')
  // async logout(@Req() req: RequestToken, @Body() body: { refreshToken: string }, @Res() res: Response) {
  //   try {
  //     const token_key = `bl_${req.header('Authorization')?.replace('Bearer ', '')}`;
  //     await this.redisService.redisClient.set(token_key, req.header('Authorization')?.replace('Bearer ', ''));
  //     this.redisService.redisClient.expireAt(token_key, Number(req.tokenData.exp));

  //     const refresh_token = `bl_refresh_${body.refreshToken}`
  //     await this.redisService.redisClient.set(refresh_token, body.refreshToken);
  //     let refreshTokenData = token.decodeRefreshToken(body.refreshToken);

  //     this.redisService.redisClient.expireAt(refresh_token, Number((refreshTokenData as any).exp));
  //     return res.status(HttpStatus.OK).json({
  //       message: this.i18n.t('success-message.auth.LogoutOk', { lang: I18nContext.current().lang })
  //     })
  //   } catch (error) {
  //     console.log("lỗi", error);
  //     if (error instanceof HttpException) {
  //       return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause })
  //     }
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
  //   }
  // }
  @Get('/logout')
  async logout(@Req() req: RequestToken, @Body() body: { refreshToken: string }, @Res() res: Response) {
    try {
      // Loại bỏ token access khỏi danh sách token hợp lệ hoặc danh sách denylist
      const token_key = `token_${req.tokenData.id}`;
      await this.redisService.redisClient.del(token_key);

      // Loại bỏ refresh token khỏi danh sách refresh token hợp lệ
      const refresh_token_key = `refresh_token_${req.tokenData.id}`;
      await this.redisService.redisClient.del(refresh_token_key);

      return res.status(HttpStatus.OK).json({
        message: this.i18n.t('success-message.auth.LogoutOk', { lang: I18nContext.current().lang })
      });
    } catch (error) {
      console.log("lỗi", error);
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Get('/check-token')
  async checkToken(@Req() req: RequestToken, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json({ message: this.i18n.t('success-message.auth.decodeTokenOK', { lang: I18nContext.current().lang }), data: { ...req.tokenData } })
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }
  @Get('/refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }, @Res() res: Response) {
    try {
      const inDenyList = await this.redisService.redisClient.get(`bl_refresh_${body.refreshToken}`);
      if (inDenyList) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
      }
      let refreshTokenData = token.decodeRefreshToken(body.refreshToken);
      if (refreshTokenData) {
        let result = this.adminService.findByEmail((refreshTokenData as any).email);
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
}
