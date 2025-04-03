import CartItem from "../../models/CartItem.js";

/**
 * Get all cart items for a specified user, including full product information.
 *
 * @function
 * @async
 * @param {Express.Request} request - Express request object.
 * @param {Express.Response} response - Express response object.
 * @returns {Object} - JSON response with cart items and associated product information.
 * @throws {Object} - JSON response with an error message if an error occurs.
 */
export const getCartItems = async (request, response) => {
  try {
    const userId = request.params.userId;
    const { newCurrency = "USD" } = request.query;
    const cartItems = await CartItem.find({ userId }).populate('productId'); // Poblar con los productos

    if (!cartItems) {
      return response.status(404).json({ error: 'Cart not found for the specified user' });
    }

    const cartItemsWithProductInfo = await Promise.all(cartItems.map(async (cartItem) => {
      const { _id, quantity, productId } = cartItem;

      if (!productId) {
        return {
          cartItemId: _id,
          quantity,
        };
      }
    }));

    response.status(200).json(cartItemsWithProductInfo);
  } catch (error) {
    response.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};
