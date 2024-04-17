import { Schema } from "mongoose";
import { TokenModel } from "../models/token.model";
import { userInfoDto } from "../dto/userInfoForToken";
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

class TokenService{
    createTokens(userDto: userInfoDto){
        const access_token = jwt.sign({userDto}, process.env.JWT_ACCESS_SECRET as string, {expiresIn: '20m'});
        const refresh_token = jwt.sign({userDto}, process.env.JWT_REFRESH_SECRET as string, {expiresIn: '1d'});
        return {
            access_token,
            refresh_token,
        }
    }

    async saveRefreshToken(userId: Schema.Types.ObjectId, refreshToken: string){
        const exist_token = await TokenModel.findOne({userId: userId})
        if(exist_token){
            exist_token.refreshToken = refreshToken;
            return exist_token.save();
        }
        return await TokenModel.create({refreshToken: refreshToken, userId: userId})
    }

    async deleteRefreshToken(refresh_token: string){
        return await TokenModel.findOneAndDelete({refreshToken: refresh_token});
    }

    async getUserIdByRefreshToken(refresh_token: string){
        const token = await TokenModel.findOne({refreshToken: refresh_token})
        if(!token) return;

        return token.userId;
    }

    async refreshTokens(refresh_token: string, userDto: userInfoDto){
        if(!refresh_token) return;
        
        const UserData = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET as string)
        if(typeof UserData === 'string' || userDto.id !== UserData.id) return;

        const tokens = this.createTokens(userDto);
        await this.saveRefreshToken(UserData.id, tokens.refresh_token);

        return {...tokens}
    }
}

export = new TokenService();