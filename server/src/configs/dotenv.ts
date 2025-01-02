import dotenv from "dotenv";
import path from "path";
const env = process.env.APP_ENV;
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });
export {};