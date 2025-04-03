import CartItem from '../../models/CartItem.js';
import { doesUserExistById, validateCartItemData } from '../methods/validations.js';

/**
 * Add a new cart item.
 * @param {Express.Request} req - request object.
 * @param {Express.Response} res - response object.
 * @returns {Promise<void>}
 */
export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const { errors } = await validateCartItemData(userId, productId, quantity);

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const existingCartItem = await CartItem.findOne({ userId, productId });

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            return res.status(200).json(existingCartItem);
        }

        const newCartItem = new CartItem({
            userId,
            productId,
            quantity,
        });

        await newCartItem.save();
        res.status(201).json(newCartItem);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error'});
    }
};

/**
 * Edit the quantity of a product in the user's shopping cart.
 *
 * @function
 * @async
 * @param {Express.Request} req - Express request object.
 * @param {Express.Response} res - Express response object.
 * @returns {Object} - JSON response with the updated cart item.
 * @throws {Object} - JSON response with an error message if an error occurs.
 */
export const editCartItemQuantity = async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;
        const newQuantity = req.body.quantity;

        const { errors } = await validateCartItemData(userId, productId, newQuantity);

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const cartItem = await CartItem.findOne({ userId, productId });

        if (!cartItem) {
            const newCartItem = new CartItem({
                userId,
                productId,
                quantity: newQuantity
            });
            await newCartItem.save();
            return res.status(201).json(newCartItem);
        }

        cartItem.quantity = newQuantity;

        if (newQuantity === 0) {
            await cartItem.remove();
            return res.status(200).json({ message: 'Cart item deleted successfully' });
        }

        const updatedCartItem = await cartItem.save();
        res.status(200).json(updatedCartItem);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


/**
 * Delete a cart item from the user's shopping cart.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response indicating the success of the operation.
 * @throws {Object} - JSON response with an error message if an error occurs.
 */
export const deleteCartItem = async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;

        const cartItem = await CartItem.findOne({ userId, productId });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found for the specified user and product' });
        }

        await CartItem.deleteOne({ userId, productId });
        res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' + error });
    }
};

/**
 * Delete all cart items for a user from the shopping cart.
 *
 * @function
 * @async
 * @param {Express.Request} req - Express request object.
 * @param {Express.Response} res - Express response object.
 * @returns {Object} - JSON response indicating the success of the operation.
 * @throws {Object} - JSON response with an error message if an error occurs.
 */
export const deleteAllCartItems = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cartItemsExist = await CartItem.exists({ userId });

        if (!cartItemsExist) {
            return res.status(404).json({ error: 'No cart items found for the specified user' });
        }

        await CartItem.deleteMany({ userId });
        res.status(200).json({ message: 'All cart items deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Add multiple cart items to the user's shopping cart.
 *
 * @function
 * @async
 * @param {Express.Request} req - Express request object.
 * @param {Express.Response} res - Express response object.
 * @returns {Object} - JSON response with the updated cart items.
 * @throws {Object} - JSON response with information about products that couldn't be added.
 */
export const addMultipleToCart = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;
        const userExists = await doesUserExistById(userId);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { updatedCartItems, failedToAdd } = await processCartItems(userId, cartItems);

        const response = {
            updatedCartItems,
            failedToAdd,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Process cart items and update the user's shopping cart.
 *
 * @function
 * @async
 * @param {string} userId - User ID.
 * @param {Array} cartItems - Array of cart items to be added.
 * @returns {Object} - Object containing updated and failed cart items.
 */
const processCartItems = async (userId, cartItems) => {
    const failedToAdd = [];
    const updatedCartItems = [];

    for (const cartItemData of cartItems) {
        const { productId, quantity } = cartItemData;
        const { errors } = await validateCartItemData(userId, productId, quantity);

        if (errors.length > 0) {
            failedToAdd.push({  productId, reason: errors[0].error, });
            continue;
        }

        const existingCartItem = await CartItem.findOne({ userId, productId });

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            updatedCartItems.push(existingCartItem);
        } else {
            const newCartItem = new CartItem({ userId, productId, quantity });
            await newCartItem.save();
            updatedCartItems.push(newCartItem);
        }
    }

    return { updatedCartItems, failedToAdd };
};
