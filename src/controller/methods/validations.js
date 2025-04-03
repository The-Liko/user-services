import Product from '../../models/Product.js';
import User from '../../models/User.js';

/**
 * Validates cart item data, checking user existence, product existence, quantity availability, and quantity validity.
 *
 * @param {string} userId - The user ID associated with the cart item.
 * @param {string} productId - The product ID associated with the cart item.
 * @param {number} quantity - The quantity of the product in the cart item.
 * @returns {Object} - An object with validation results.
 */
export const validateCartItemData = async (userId, productId, quantity) => {
    const errors = [];
    const userExists = await doesUserExistById(userId);
  
    if (!userExists) {
      errors.push({ field: 'userId', error: 'User not found' });
    }
  
    const productInfo = await checkProductExistsAndGetQuantity(productId);
  
    if (!Number.isInteger(quantity) || quantity < 1) {
      errors.push({ field: 'quantity', error: 'Quantity should be higher than 0' });
    }

    return { errors, productInfo };
};

/**
 * Check if a user exists by ID.
 *
 * @function
 * @async
 * @param {string} userId - The ID of the user to check.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the user exists, and `false` otherwise.
 * @throws {Error} - If an error occurs during the database query.
 */
export const doesUserExistById = async (userId) => {
    try {
        const user = await User.findById(userId);
        return !!user;
    } catch (error) {
        return false;
    }
};

/**
 * Checks the existence of a product by its ID.
 *
 * @param {string} productId - The ID of the product.
 * @returns {Promise<boolean>} A promise that resolves to true if the product exists, false otherwise.
 */
export const doesProductExistById = async (productId) => {
    try {
        const product = await Product.findById(productId);
        return !!product;
    } catch (error) {
        return false;
    }
};


/**
 * Check if a product exists and get its quantity.
 *
 * @function
 * @async
 * @param {string} productId - The ID of the product to check.
 * @returns {Object} - Object containing a boolean 'exists' indicating if the product exists
 *                    and 'quantity' with the product quantity if it exists.
 */
export const checkProductExistsAndGetQuantity = async (productId) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            return { exists: false, quantity: 0 };
        }
        return { exists: true, quantity: product.quantity };
    } catch (error) {
        return { exists: false, quantity: 0 };
    }
};

/**
 * Validates if a user exists in the database.
 * @param {string} userId - The ID of the user to validate.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the user exists or not.
 */
export const validateUserExist = async (userId) => {
    try {
      const user = await User.findById(userId);
      return !!user;
    } catch (error) {
      return false;
    }
  }
  
