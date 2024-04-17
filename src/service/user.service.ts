import {userModel} from "../models/user.model"
import { Schema } from "mongoose";

class UserService {
    async getUserByLogin(login: string){
        if(!login) return;
        const user = await userModel.findOne({login: login})
        return user;
    }

    async getUserByEmail(email: string){
        if(!email) return;
        const user = await userModel.findOne({email: email});
        return user;
    }

    async getUserById(id: any){
        if(!id) return;
        const user = await userModel.findById(id);
        return user;
    }

    async createUser(login: string , email: string, password: string, activationLink: string){
        if(!login || !email || ! password) return;
        
        if(await this.checkUserByLoginOrEmail(login, email)) {
            return;
        }
        const new_user = await userModel.create({
            login: login,
            email: email,
            password: password,
            activationLink: activationLink,
        })
        return new_user;
    }

    async checkUserByLoginOrEmail(login: string, email: string){
        let existByLogin = await this.getUserByLogin(login);
        if(existByLogin) {return true;}

        let existByEmail = await this.getUserByEmail(email);
        if(existByEmail) {return true;}

        return false;
    }

    async deleteUserByLogin(login: string){
        if(!login) return false;
        
        const result = await userModel.deleteOne({login: login})
        if(result.deletedCount === 1) return true;

        return false
    }

    async activateUser(link: string){
        if(!link) return;
        const unactive_user = await userModel.findOneAndUpdate({activationLink: link}, {isActivate: true})
        return true;
    }

    async getAllUsers(){
        const users = await userModel.find();
        return users;
    }
}

export = new UserService();