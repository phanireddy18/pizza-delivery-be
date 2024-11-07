import dotenv from "dotenv";

dotenv.config({});

class Config {
  public JWT_SECRET: string | undefined;
  public NODE_ENV: string | undefined;
  public SERVER_PORT: string | undefined;
  public POSTGRESS_HOST: string | undefined;
  public POSTGRESS_DB: string | undefined;
  public POSTGRESS_PWD: string | undefined;
  public POSTGRESS_USER: string | undefined;
  public SWAGGER_URL: string | undefined;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || "1234";
    this.NODE_ENV = process.env.NODE_ENV || "";
    this.SERVER_PORT = process.env.SERVER_PORT || "7000";
    this.POSTGRESS_HOST = process.env.POSTGRESS_HOST || "";
    this.POSTGRESS_DB = process.env.POSTGRESS_DB || "";
    this.POSTGRESS_PWD = process.env.POSTGRESS_PWD || "";
    this.POSTGRESS_USER = process.env.POSTGRESS_USER || "";
    this.SWAGGER_URL = process.env.SWAGGER_URL || "";
  }
}

export const config: Config = new Config();
