import { Body, Controller, HttpException, HttpStatus, Post, Req, Res, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginAuthDTO } from './dtos/login-auth.dto';
import { RegisterAuthDTO } from './dtos/register-auth.dto';
import { TransformationType } from 'class-transformer';
import { SecureUtils } from 'src/shared/utils';
import { Message } from '@google-cloud/pubsub';
import { I18nContext, I18nService, I18nValidationExceptionFilter } from 'nestjs-i18n';


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

    } catch (err) {

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
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json({ message: error.getResponse().toString(), error: error.cause })
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: this.i18n.t("err-message.errors.serverError", { lang: I18nContext.current().lang }), error: 'InternalServerError' })
    }
  }

}
