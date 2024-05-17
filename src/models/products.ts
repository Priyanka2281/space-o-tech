import mongoose, { Document, Schema } from 'mongoose';

interface IProduct extends Document {
    title: string;
    images: string[];
    price: number;
    discountPrice: number;
    description: string;
    stock: number;
}

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    images: [
        { type: String }
    ],
    price: {
        type: Number,
        required: true
    },
    discountPrice:
        { type: Number },
    description:
    {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    isDeleted:{
         type:Boolean,
         default:false
    }
},{timestamps:true});

export default mongoose.model<IProduct>('products', productSchema);
