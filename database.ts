import { Sequelize } from "sequelize";
import { config } from "./config";

export const sequelize = new Sequelize(
  `${config.POSTGRESS_DB}`,
  `${config.POSTGRESS_USER}`,
  `${config.POSTGRESS_PWD}`,
  {
    host: `${config.POSTGRESS_HOST}`,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    port: 5431,
  }
);

// Function to establish database connection
export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log(
      "PostgreSQL database connection has been established successfully."
    );
  } catch (error) {
    console.log(" Unable to connect to database.");
    console.log("error", "databaseConnection() method error: ", error);
  }
}
