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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const user_service_1 = __importDefault(require("../service/user.service"));
const uuid_1 = __importDefault(require("uuid"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { login, email, password } = req.body;
            if (login === undefined) {
                login = 'user' + uuid_1.default.v4().toString();
            }
            if (yield user_service_1.default.checkUserByLoginOrEmail) {
                return res.status(400).json({ message: 'User with this login or password already exist' });
            }
            const hash_pass = yield bcrypt_1.default.hash(password, 7);
            const new_user = yield user_service_1.default.createUser(login, email, hash_pass);
            res.status(201).json(new_user);
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const exist_user = yield user_service_1.default.getUserByEmail(email);
            if (!exist_user) {
                return res.status(400).json({ message: "User with this email doesn't exist" });
            }
            if (yield bcrypt_1.default.compare(password, exist_user.password)) {
                return res.status(200).json({ message: "Succes login" });
            }
            res.status(400).json({ message: "Wrong password" });
        });
    }
}
module.exports = new UserController();
