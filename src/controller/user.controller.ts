import { UserRegistration } from '../dto/userRegistrationUnput';
import { RequestWithBody, RequestWithParams } from '../request.type';
import UserService from '../service/user.service'
import { Request, Response } from 'express';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt'
import { UserLogin } from '../dto/userLoginInput';
import { userInfoDto } from '../dto/userInfoForToken';
import TokenService from '../service/token.service';
import mailService from '../service/mail.service';
import mongoose, { Schema } from 'mongoose';
import dotenv from "dotenv"
import BasketService from '../service/basket.service';

dotenv.config();

class UserController {
    async registration(req: RequestWithBody<UserRegistration>, res: Response) {
        let {login, email, password} = req.body;

        if(!login) login = 'user' + uuidv4().slice(0, 8);
        const hash_pass = await bcrypt.hash(password, 7);
        const activationLink = uuidv4();

        const new_user = await UserService.createUser(login, email, hash_pass, activationLink);
        if(!new_user){
            return res.status(400).json({message: `User with this login or email already exist ${login}`})
        }

        const new_basket = await BasketService.create(new Schema.Types.ObjectId(new_user._id.toString()))
        if(!new_basket){
            return res.status(400).json({message: `Basket for this login or email already exist ${login}`})
        }

        const userDto = new userInfoDto(new_user);
        const tokens = await TokenService.createTokens(userDto);
        await TokenService.saveRefreshToken(userDto.id as Schema.Types.ObjectId, tokens.refresh_token)

        await mailService.sendMail(email, `http://localhost:${process.env.PORT}/user/activate/${activationLink}`)

        res.status(201).json(new_user)
    }

    async activate(req: RequestWithParams<{link: string}>, res: Response){
        const link = req.params.link;
        
        const user_activate = await UserService.activateUser(link);

        if(user_activate) return res.status(302).redirect(`http://localhost:${process.env.PORT}/`)
        res.status(404).json({message: "Activation is failed"})
    }

    async login(req: RequestWithBody<UserLogin>, res: Response){
        const { email, password } = req.body;

        const exist_user = await UserService.getUserByEmail(email);
        if(!exist_user){
            return res.status(400).json({message: "User with this email doesn't exist"})
        }

        if(!await bcrypt.compare(password, exist_user.password as string)){
            return res.status(400).json({message: "Wrong password"})
        }
        
        const userDto = new userInfoDto(exist_user);
        const tokens = await TokenService.createTokens(userDto);
        await TokenService.saveRefreshToken(userDto.id as Schema.Types.ObjectId, tokens.refresh_token)

        res.removeHeader("Authorization")
        res.setHeader("Authorization", `Bearer ${tokens.access_token}`);
        res.cookie("refreshToken", tokens.refresh_token, {signed: true, httpOnly: true})

        res.status(200).json({message: "Succes login", tokens: {...tokens}})
    }

    async logout(req: Request, res: Response){
        const refresh_token = req.signedCookies.refreshToken;
        if(!refresh_token){
            console.log("Refresh token dont exist!!");
            return res.status(404).send();
        }
        await TokenService.deleteRefreshToken(refresh_token);
        console.log("Refresh token deleted:", refresh_token);
        
        res.removeHeader("Authorization");
        console.log("Authorization header removed");
        
        res.clearCookie("refreshToken");
        console.log("Refresh token cookie cleared");
    
        res.status(200).json("Success logout");
    }

    async deleteUser(req: RequestWithParams<{login: string}>, res: Response){
        const login = req.params.login;

        const user = await UserService.getUserByLogin(login);
        if(!user) return res.status(400).json({message: "Unknown user login"});

        const result = await UserService.deleteUserByLogin(login);
        if(!result) return res.status(404).json({message: "Delete error"});

        res.status(204).send()
    }

    async getUser(req: RequestWithParams<{login: string}>, res: Response){
        const login = req.params.login;

        const user = await UserService.getUserByLogin(login);
        if(!user) return res.status(400).json({message: "Unknown user login"});

        res.status(200).json(user)
    }

    async getAllUsers(req: Request, res: Response){
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    }
}

export = new UserController(); 