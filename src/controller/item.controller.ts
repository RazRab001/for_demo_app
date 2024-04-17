import { Request, Response } from "express"
import itemService from "../service/item.service"
import busketService from "../service/basket.service"
import { ItemDocument } from "../models/item.model"
import { basketDockument } from "../models/basket.model"
import {v4 as uuidv4} from 'uuid';
import path from 'path'
import { userInfoDto } from "../dto/userInfoForToken"
import { Schema } from "mongoose"
import { RequestWithFiles } from "../request.type"
import basketService from "../service/basket.service"
import { UserInfo } from "os"

class ItemController{
    async createItem(req: RequestWithFiles, res: Response){
        try{
            const {name, price, desc} = req.body.input;
            const {img} = req.files; 
            const user = req.user;

            if(!name || !price || !desc || !img) return res.status(400).json({message: "Bad request"})

            let fileName: string = uuidv4() + '.jpg'
            img.mv(path.resolve(__dirname, "../../static", fileName))

            const itemData: ItemDocument = {img: fileName, name: name, price: price, owner: user, desc: desc} as ItemDocument
            const new_item = await itemService.create(itemData)

            if(!new_item) return res.status(500).json({message: "Fatal error with item creation"})

            res.status(200).json(new_item);
        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    async deleteItem(req: Request, res: Response){
        const itemId = req.params.item;
        const rezult = await itemService.changeActivateStateItem(new Schema.Types.ObjectId(itemId), false)
        if(rezult === undefined) return res.status(400).json({message: "Error with item delete"})
        res.status(200).json(rezult)
    }

    async addItemToBusket(req: Request, res: Response){
        const itemId = req.params.item;
        const user: userInfoDto = req.user as userInfoDto;
        if(!user) return res.status(404);
        const item = await itemService.findItemById(new Schema.Types.ObjectId(itemId))

        let busket: basketDockument;
        if(item && item.active === true){
            busket = await busketService.addItem(user?.id, new Schema.Types.ObjectId(item?._id.toString()));
            if(!busket) return res.status(500).json({message: "server error with iem ading"})
        } else {
            res.status(400).json({message: "Item doesn't exist"})
        }
    }

    async dropItemFromBusket(req: Request, res: Response){
        const itemId = req.params.item;
        const user: userInfoDto = req.user as userInfoDto;

        const item = await itemService.findItemById(new Schema.Types.ObjectId(itemId))

        if(await basketService.deleteItem(user.id, new Schema.Types.ObjectId(itemId))){
            return res.status(204)
        } else {
            return res.status(400)
        }
    }

    async buyItems(req: Request, res: Response){
        const user: userInfoDto = req.user as userInfoDto

        const items = await basketService.getItemsFromBasket(user.id)
        if(items) return res.status(200)
    }
}

export = new ItemController()