import { Request, Response, NextFunction } from "express";
import userService from "../service/user.service";
import tokenService from "../service/token.service";
import { userInfoDto } from "../dto/userInfoForToken";


export = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(404).json({message: "Authorization header not found"});
    }

    const refresh_token = req.signedCookies.refreshToken;
    if(!refresh_token) return res.status(404).json({message: "Refresh token in signed cookie not found"});

    const access_token = authHeader.split(' ')[1];
    let user;
    if(!access_token){
        const userId = await tokenService.getUserIdByRefreshToken(refresh_token);
        if(!userId) return res.status(404).json({message: "Refresh token found, but user id not found"});

        user = await userService.getUserById(userId);
        if(!user) return res.status(404).json({message: "Refresh token found, user id found, but user not found"});

        const userDto = new userInfoDto(user)
        const tokens = await tokenService.refreshTokens(refresh_token, userDto)
        if(!tokens) return res.status(404).json({message: "Error with refreshing tokens"});

        res.setHeader("Authorization", `Bearer ${tokens.access_token}`);
    }
    req.user = user;
    next();
}