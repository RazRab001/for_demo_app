import { Schema } from "mongoose";

export class userInfoDto {
    id?: Schema.Types.ObjectId;
    email?: string;
    isActive?: boolean;

    constructor(user: any){
        this.id = user._id;
        this.email = user.email;
        this.isActive = user.isActivate;
    }
}