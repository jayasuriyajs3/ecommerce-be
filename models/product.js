const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: false,
        },
        name: {
            type: String,
            required: false,
        },
        price: {
            type: mongoose.Schema.Types.Mixed, // Accept both String and Number
            required: false,
        },
        description: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
    },
    { 
        timestamps: true,
        strict: false // Allow fields not in schema
    }
);

// Prevent OverwriteModelError by reusing compiled model if present
// Keep collection name as 'productste' to match existing data in MongoDB
const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'productste');
module.exports = Product;

