import mongoose, { Schema } from "mongoose";

export type ItemForBasket = Document & {
    item: Schema.Types.ObjectId,
    count: Number
}

const ItemForBasketSchema = new mongoose.Schema<ItemForBasket>({
    item: {type: Schema.Types.ObjectId, ref: 'item'},
    count: {type: Number, default: 1}
})

export const ItemForBasketModel = mongoose.model("itemForBasket", ItemForBasketSchema)