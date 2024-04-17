"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const user_model_1 = require("../models/user.model");
class UserService {
    getUserByLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!login)
                return;
            const user = yield user_model_1.userModel.findOne({ login: login });
            return user;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                return;
            const user = yield user_model_1.userModel.findOne({ email: email });
            return user;
        });
    }
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!login || !email || !password)
                return;
            const new_user = yield user_model_1.userModel.create({
                login: login,
                email: email,
                password: password
            });
            return new_user;
        });
    }
    checkUserByLoginOrEmail(title) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield !this.getUserByEmail) && (yield !this.getUserByLogin)) {
                return false;
            }
            return true;
        });
    }
}
module.exports = new UserService();
