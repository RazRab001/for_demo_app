import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: {type: String},
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isActivate: {type: Boolean, default: false},
    activationLink: {type: String, unique: true},
});

export const userModel = mongoose.model('user', userSchema);
