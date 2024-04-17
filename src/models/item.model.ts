import mongoose, { Schema } from "mongoose";

export type ItemDocument = Document & {
    img: string,
    name: string, 
    price: Schema.Types.Decimal128,
    owner: Schema.Types.ObjectId,
    active: boolean
    desc: string
}

const itemSchema = new mongoose.Schema<ItemDocument>({
    img: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: Schema.Types.Decimal128, default: 1},
    owner: {type: Schema.Types.ObjectId, required: true, ref: 'user'},
    active: {type: Boolean, default: true},
    desc: {type: String},
})

export const itemModel = mongoose.model('item', itemSchema)