import mongoose, { Schema } from "mongoose";

export type basketDockument = Document & {
    owner: Schema.Types.ObjectId,
    items: [Schema.Types.ObjectId]
}

const basketSchema = new Schema<basketDockument>({
    owner: {type: Schema.Types.ObjectId, required: true, ref: 'user'},
    items: [{type: Schema.Types.ObjectId, ref: 'item'}]
})

export const basketModel = mongoose.model('basket', basketSchema)