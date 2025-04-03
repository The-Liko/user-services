let exchangeRates = {};

export const fetchExchangeRates = async () => {
  try {
    const response = await fetch(
      'http://data.fixer.io/api/latest?access_key=1801f6f55e4b1a0c331dd64b90b7f137'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();

    exchangeRates = data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
};

export const getExchangeRates = () => exchangeRates;
