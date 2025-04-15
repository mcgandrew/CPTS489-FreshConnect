import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    vendor:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    unit:{
        type: String,
        required: true
    },
    category:{
        type: String,
        enum: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Honey', 'Eggs'],
        required: true
    },
    location:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: false
    },
    description:{
        type: String,
        default: ''
    }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema)