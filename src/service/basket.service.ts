import {basketDockument, basketModel} from '../models/basket.model'
import { Schema } from 'mongoose';

class BasketService{

    async getUserBasket(user: Schema.Types.ObjectId | undefined){
        if(!user) return;

        const exist_basket: typeof basketModel | null = await basketModel.findOne({owner: user})
        return exist_basket;
    }

    async create(user: Schema.Types.ObjectId){
        if(this.getUserBasket(user) !== undefined) return;

        const basket = await basketModel.create({owner: user})
        return basket
    }

    async addItem(user: Schema.Types.ObjectId | undefined, itemId: Schema.Types.ObjectId | undefined){
        const basket: any = await this.getUserBasket(user)
        if(basket === undefined) return;
        
        basket.items.push(itemId);
        await basket.save();

        return basket
    }

    async deleteItem(user: Schema.Types.ObjectId | undefined, itemId: Schema.Types.ObjectId | undefined){
        const basket: any = await this.getUserBasket(user)
        if(basket === undefined) return false;

        const index = basket.items.indexOf(itemId)
        if(index > -1){
            basket.items.splice(index, 1)
            await basket.save()
            return true;
        }
        return false;
    }

    async getItemsFromBasket(user: Schema.Types.ObjectId | undefined){
        const basket: any = await this.getUserBasket(user)
        if(basket === undefined) return;

        let items = basket.items;

        let ItemsAndCounts: {[key: string]: number} = {};
        for(let i = 0; i < items; i++){
            let itemId = items[i].toString();
            if(ItemsAndCounts[itemId]){
                ItemsAndCounts[itemId]++;
            } else {
                ItemsAndCounts[itemId] = 1;
            }
        }

        return ItemsAndCounts
    }
}

export = new BasketService()