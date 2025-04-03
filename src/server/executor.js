import { scheduleJob } from "node-schedule";
import { fetchExchangeRates } from "../controller/requests/exchangeRatesReq.js";
import { connectToDatabase } from "../database/connection.js";
import serverApp from "./settings.js";

/**
 * Method to start the server.
 */
export const startServer = async () => {
  const port = process.env.PORT || 3000; // Usar el puerto de la variable de entorno, o 3000 por defecto
  const jwtSecret = process.env.JWT_SECRET; // Obtener la clave secreta de JWT desde las variables de entorno

  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined!");
    process.exit(1); 
  }

  if (port) {
    connectToDatabase();
    serverApp.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

  await fetchExchangeRates();
};

/**
 * Schedule the task to fetch exchange rates daily at midnight
 */
scheduleJob("0 0 * * *", async () => {
  console.log("Fetching exchange rates...");
  await fetchExchangeRates();
});
