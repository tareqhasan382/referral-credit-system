import dotenv from "dotenv";
import Path from "path";
dotenv.config({ path: Path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.MONGO_URI!,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  client_url: process.env.CLIENT_URL,
  jwt: {
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires: process.env.JWT_ACCESS_EXPIRES,
    jwt_access_refresh_expires: process.env.JWT_ACCESS_EXPIRES,
    jwt_cookie_secure:process.env.COOKIE_SECURE,
    jwt_cookie_samesite:process.env.COOKIE_SAMESITE,
  },
};