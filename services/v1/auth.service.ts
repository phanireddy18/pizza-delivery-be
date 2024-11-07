import { sign } from "jsonwebtoken";
import { lowerCase } from "../../helpers/email.helper";
import { config } from "../../config";
import { sequelize } from "../../database";
import { IUserDocument } from "../../models/users.schema";
import { AddressModel, IAddressDocument } from "../../models/address.schema";
import { Transaction } from "sequelize";
const { Sequelize } = require("sequelize");

class AuthService {
  async createAuthUser(
    data: IUserDocument,
    transactionObj: Transaction
  ): Promise<IUserDocument | undefined> {
    try {
      const result = await sequelize.query(
        "select * from sign_up_function(:username,:phoneNumber,:password,:email);",
        {
          replacements: {
            username: data.username,
            phoneNumber: data.phoneNumber,
            password: data.password,
            email: data.email,
          },
          type: Sequelize.QueryTypes.SELECT,
          transaction: transactionObj,
        }
      );
      return result[0];
    } catch (error) {
      console.error(error);
    }
  }

  async addAddress(
    userId: number,
    address: string,
    transactionObj: Transaction
  ) {
    try {
      await AddressModel.create(
        {
          userId,
          address,
        },
        { transaction: transactionObj }
      );
    } catch (error) {
      throw new Error("Error occured while adding address");
    }
  }

  async getAddressesByUserId(userId: number): Promise<string> {
    try {
      const address: IAddressDocument | null = await AddressModel.findOne({
        where: {
          userId,
        },
      });
      return address ? address.address : "";
    } catch (error) {
      console.error("Error occured while getting address");
      return "";
    }
  }

  async getUserByEmail(email: string): Promise<IUserDocument | undefined> {
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

  signToken(
    userId: number,
    email: string,
    username: string,
    address: string
  ): string {
    return sign(
      {
        userId,
        email,
        username,
        address,
      },
      `${config.JWT_SECRET}`
    );
  }
}

export const authService: AuthService = new AuthService();
