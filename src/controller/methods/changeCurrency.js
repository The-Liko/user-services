import { getExchangeRates } from "../requests/exchangeRatesReq.js";
import { getFilterPriceWithCurrency } from "./filter.js";

/**
 * Helper function to convert a given price from one currency to a new currency.
 *
 * @param {number} priceInCurrency - The price to be converted.
 * @param {string} currentCurrency - The current currency of the price.
 * @param {string} newCurrency - The target currency for conversion (Bolivians - BOB).
 * @returns {number} - The converted price in the new curency.
 */
export const convertToCurrency = (priceInCurrency, currentCurrency, newCurrency) => {
    return (getExchangeRates()[newCurrency.toUpperCase()] / getExchangeRates()[currentCurrency]) * priceInCurrency;
}

/**
 * Converts the currency of an array of products and returns the updated products.
 *
 * @param {Array} products - The array of products to be converted.
 * @param {string} newCurrency - The target currency for conversion (e.g., 'BOB').
 * @returns {Array} - An array of products with updated currency values.
 */
export const getProductsWithNewCurrency = (products, newCurrency, ft1, ft2, ft3) => {
    const convertProductCurrency = (product) => {
        const convertedPrice = convertToCurrency(
            product.price.value,
            product.price.currency,
            newCurrency.toUpperCase()
        );

        return {
            ...product._doc,
            price: {
                ...product._doc.price,
                value: convertedPrice,
                currency: newCurrency.toUpperCase(),
            },
        };
    };

    var productsWithConvertedPrices = products.map(convertProductCurrency);

    if (ft1.startsWith("1")) {
        productsWithConvertedPrices = getFilterPriceWithCurrency(productsWithConvertedPrices, ft1);
    } else if (ft2.startsWith("1")) {
        productsWithConvertedPrices = getFilterPriceWithCurrency(productsWithConvertedPrices, ft2);
    } else if (ft3.startsWith("1")) {
        productsWithConvertedPrices = getFilterPriceWithCurrency(productsWithConvertedPrices, ft3);
    }

    return productsWithConvertedPrices;
};

  