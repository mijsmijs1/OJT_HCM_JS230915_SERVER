import { Global, HttpStatus, Injectable, Next, Req, Res } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { AuthService } from 'src/modules/auth/auth.service';
import { token } from 'src/shared/utils/token';
import { RedisService } from '../utils/redis/redis';

// export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
//   // Lấy token từ header hoặc query parameter hoặc cookie
//   const token = req.header('Authorization')?.split(' ')[1] || req.query.token || req.cookies.token;
//   if (!token) {
//     return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
//   }
//   if (token) {
//     // Giải mã token và kiểm tra tính hợp lệ
//     jwt.verify(token, 'your-secret-key', (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
//       // Lưu thông tin người dùng từ token vào req để sử dụng sau này
//       req.user = decoded;
//       next();
//     });
//   } else {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// }

export interface RequestToken extends Request {
  tokenData: any
}
@Global()
@Injectable()
export class AuthenticateJWTMiddleware {
  constructor(
    private readonly authService: AuthService,
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
        let result = await this.authService.findByEmail((decodedData as any).email, "all");
        if (!result) {
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
        }
        if ((result as any).name && !(result as any).isOpen) {
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
        }
        if ((decodedData as any).updateAt != (result as any).updateAt) {
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
        }
        await this.redisService.redisClient.set(tokenCode, JSON.stringify(decodedData));
        await this.redisService.redisClient.expireAt(tokenCode, (decodedData as any).exp);
        req.tokenData = decodedData;
        next();
      }
    } catch (err) {
      console.log('err', err)
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: this.i18n.t('err-message.errors.TokenInvalid', { lang: I18nContext.current().lang }), error: 'Unauthorized' })
    }
  }
}