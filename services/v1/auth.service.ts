import { sign } from "jsonwebtoken";
import { lowerCase } from "../../helpers/email.helper";
import { config } from "../../config";
import { sequelize } from "../../database";
import { IUserDocument } from "../../models/users.schema";
const { Sequelize } = require("sequelize");

export async function createAuthUser(
  data: IUserDocument
): Promise<IUserDocument | undefined> {
  try {
    const result = await sequelize.query(
      "select * from sign_up_function(:username,:password,:email,:address);",
      {
        replacements: {
          username: data.username,
          password: data.password,
          email: data.email,
          address: data.address,
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    return result[0];
  } catch (error) {
    console.error(error);
  }
}

export async function getUserByEmail(
  email: string
): Promise<IUserDocument | undefined> {
  try {
    const user = await sequelize.query(
      "select * from user_get_user_by_email(:email);",
      {
        replacements: {
          email: lowerCase(email),
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    return user[0];
  } catch (error) {
    console.error(error);
  }
}

export function signToken(
  userId: number,
  email: string,
  username: string
): string {
  return sign(
    {
      userId,
      email,
      username,
    },
    `${config.JWT_SECRET}`
  );
}
