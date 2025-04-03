import { Schema, model } from 'mongoose';

/**
 * @classdesc Represents the schema for a cart item in the shopping cart.
 * @class
 * @name CartItemSchema
 * @extends Schema
 */
const cartItemSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: { 
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    }
});

const CartItem = model('CartItem', cartItemSchema);
export default CartItem;
