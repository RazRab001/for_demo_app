import mongoose, { Schema } from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'user'},
    refreshToken: {type: String, required: true},
}) 

export const TokenModel = mongoose.model('token', tokenSchema)