import { getExchangeRates } from "../../infrastructure/services/exchangeRatesReq.js";

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
