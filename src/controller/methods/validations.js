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
    
    if (!Number.isInteger(quantity) || quantity < 1) {
      errors.push({ field: 'quantity', error: 'Quantity should be higher than 0' });
    }

    return { errors };
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
