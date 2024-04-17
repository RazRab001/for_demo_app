"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGO_URL);
const db = mongoose_1.default.connection;
db.on('error', (err) => console.log(`Mongo ERROR: ${err}`));
db.once('open', () => console.log('Mongo: succes connection to db'));
module.exports = db;
