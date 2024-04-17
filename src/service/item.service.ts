import { ObjectId } from "mongodb";
import {ItemDocument, itemModel} from "../models/item.model"
import { Schema } from "mongoose";

class ItemService{
    async create(input: ItemDocument){
        if(!input) return;

        const item = await itemModel.create(input);
        return item
    }

    async findItemById(id: Schema.Types.ObjectId){
        if(!id) return;

        const item = await itemModel.findById(id);
        return item
    }

    async changeActivateStateItem(id: Schema.Types.ObjectId, state: boolean){
        const item = await this.findItemById(id)

        if(!item) return;
        item.active = state;
        await item.save();
    }
}

export = new ItemService()