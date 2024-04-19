import { sign, verify } from "jsonwebtoken"

export const token = {
    createToken: (data: any, time: string = String(15 * 24 * 60 * 60 * 1000)) => {
        let token = sign({ ...data }, process.env.TOKEN_KEY, { expiresIn: time });
        return token;
    },
    createRefreshToken: (data: any, time: string = String(15 * 24 * 60 * 60 * 1000)) => {
        let token = sign({ ...data }, process.env.REFRESH_TOKEN_KEY, { expiresIn: time });
        return token;
    },
    decodeToken: (token: string) => {
        try {
            let data = verify(token, process.env.TOKEN_KEY);
            if (data) {
                return data; // Token được giải mã thành công
            } else {
                // Trường hợp token không giải mã được do sai mã
                return false;
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                // Trường hợp token không giải mã được do hết hạn
                return 'expired';
            } else {
                // Trường hợp xảy ra lỗi khi giải mã token
                return false;
            }
        }
    },
    decodeRefreshToken: (refreshToken: string) => {
        try {
            let data = verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
            if (data) {
                return data;
            }
            return false;
        } catch (err) {
            return false;
        }
    }
}