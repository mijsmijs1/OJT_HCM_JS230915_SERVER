import { Global, HttpStatus, Injectable, Next, Req, Res } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { AdminService } from 'src/modules/admin/admin.service';
import { token } from 'src/shared/utils/token';
import { RedisService } from '../utils/redis/redis';
export interface RequestToken extends Request {
    tokenData: any
}
@Global()
@Injectable()
export class AdminJWTMiddleware {
    constructor(
        private readonly adminService: AdminService,
        private readonly i18n: I18nService,
        private readonly redisService: RedisService
    ) { }
    async use(@Req() req: RequestToken, @Res() res: Response, @Next() next: NextFunction) {
        try {
            let tokenCode: string = req.header('Authorization')?.replace('Bearer ', '') || req.query.token || req.cookies.token;
            if (!tokenCode || tokenCode == 'undefined') {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
            }
            const inDenyList = await this.redisService.redisClient.get(`bl_${tokenCode}`);
            if (inDenyList) {
                console.log('inDenyList', inDenyList, typeof inDenyList)
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
            }
            let decodedData = token.decodeToken(tokenCode)
            if (decodedData == 'expired') {
                return res.status(HttpStatus.GATEWAY_TIMEOUT).json({ message: this.i18n.t('err-message.errors.TokenExpired', { lang: I18nContext.current().lang }), error: 'Token Expired' })
            }
            if (!decodedData || decodedData == 'null' || decodedData == 'undefined') {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
            }
            const dataFromRedis = await this.redisService.redisClient.get(tokenCode);
            if (dataFromRedis != '{}' && dataFromRedis && decodedData !== 'null') {
                req.tokenData = JSON.parse(dataFromRedis);
                next();
            } else {
                //admin//
                let isAdmin = await this.adminService.findById((decodedData as any).id)
                if (!isAdmin) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.NotAdmin', { lang: I18nContext.current().lang }), error: 'Unauthorized' });
                }
                let resultAdmin = await this.adminService.findById((decodedData as any).id)
                if (!resultAdmin) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
                }
                if ((resultAdmin as any).isAdmin != 1) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
                }
                if ((decodedData as any).updateAt != (resultAdmin as any).updateAt) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
                }
                let DataAdmin = await this.adminService.findById((decodedData as any).id);
                await this.redisService.redisClient.set(tokenCode, JSON.stringify(DataAdmin));
                await this.redisService.redisClient.expireAt(tokenCode, (decodedData as any).exp);
                req.tokenData = { ...DataAdmin, exp: (decodedData as any).exp };
                console.log(req.tokenData)
                next();
                //admin//
            }
        } catch (err) {
            console.log('err', err)
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
        }
    }
}