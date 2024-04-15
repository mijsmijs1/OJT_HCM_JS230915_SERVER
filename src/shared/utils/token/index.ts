import { sign, verify } from "jsonwebtoken"

export const token = {
    createToken: (data: any, time: string = String(24 * 24 * 60 * 1000)) => {
        let token = sign({ ...data }, process.env.TOKEN_KEY, { expiresIn: time });
        return token;
    },
    createRefreshToken: (data: any, time: string = String(7 * 24 * 24 * 60 * 1000)) => {
        let token = sign({ ...data }, process.env.REFRESH_TOKEN_KEY, { expiresIn: time });
        return token;
    },
    decodeToken: (token: string) => {
        try {
            let data = verify(token, process.env.TOKEN_KEY);
            if (data) {
                return data;
            }
            return false;
        } catch (err) {
            return false;
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