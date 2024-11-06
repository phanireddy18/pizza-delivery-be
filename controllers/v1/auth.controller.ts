import { StatusCodes } from "http-status-codes";
import messageHelper from "../../helpers/message.helper";
import { signupSchema } from "../../schemes/signup";
import { omit } from "lodash";
import { authService } from "../../services/v1/auth.service";
import {
  comparePassword,
  getHashedPassword,
} from "../../helpers/password.helper";
import { firstLetterUppercase, lowerCase } from "../../helpers/email.helper";
import { signinSchema } from "../../schemes/signin";
import { IUserDocument } from "../../models/users.schema";
import { Transaction } from "sequelize";
import { sequelize } from "../../database";
import { IAddressDocument } from "../../models/address.schema";

interface IAuthDocument {
  userId: number;
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
  address?: string;
  isActive?: boolean;
  token?: string;
}
export class AuthController {
  public static async create(
    req: Request | any,
    res: Response | any
  ): Promise<void> {
    try {
      const { error } = await Promise.resolve(signupSchema.validate(req.body));
      if (error?.details) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: true, message: error.details[0].message });
      }

      const { username, phoneNumber, email, password, address } = req.body;
      const checkIfUserExist: IAuthDocument | undefined =
        await authService.getUserByEmail(email);

      if (checkIfUserExist) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: true,
          message: messageHelper.EMAIL_EXISTS,
        });
      }
      const hashed_password: any = await getHashedPassword(password);
      const authData: IAuthDocument = {
        username: firstLetterUppercase(username),
        email: lowerCase(email),
        password: hashed_password,
        phoneNumber,
      } as IAuthDocument;

      //Start Transaction
      const transactionObj: Transaction = await sequelize.transaction();
      try {
        const user: IAuthDocument = (await authService.createAuthUser(
          authData,
          transactionObj
        )) as IAuthDocument;

        await authService.addAddress(user.userId, address, transactionObj);

        const userJWT: string = authService.signToken(
          user.userId!,
          user.email!,
          user.username!,
          address
        );
        user.token = userJWT;
        await transactionObj.commit();
        res.status(StatusCodes.CREATED).json({
          message: messageHelper.USER_CREATE_SUCCESS,
          error: false,
          data: user,
        });
      } catch (error) {
        await transactionObj.rollback();
        throw new Error("Error occured while adding address");
      }
    } catch (error) {
      console.error("Error in create function:", error);
      throw new Error("Error occured while adding address");
    }
  }

  public static async login(
    req: Request | any,
    res: Response | any
  ): Promise<void> {
    const { error } = await Promise.resolve(signinSchema.validate(req.body));
    if (error?.details) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: true, message: error.details[0].message });
    }

    const { email, password } = req.body;
    const existingUser: IUserDocument | undefined =
      await authService.getUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({
        error: true,
        message: messageHelper.USER_NOT_FOUND,
      });
    }
    const passwordsMatch = comparePassword(
      password,
      `${existingUser.password}`
    );

    if (!passwordsMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: true,
        message: messageHelper.INVALID_CREDENTIALS,
      });
    }
    let userJWT = "";
    let userData: Omit<IAuthDocument, "password"> | null = null;
    let message = messageHelper.LOGIN_SUCCESS;
    const address: string = await authService.getAddressesByUserId(
      existingUser.userId
    );
    userJWT = authService.signToken(
      existingUser.userId,
      existingUser.email,
      existingUser.username,
      address
    );
    userData = omit(existingUser, ["password"]);
    userData.token = userJWT;
    res.status(StatusCodes.OK).json({
      error: false,
      message,
      data: userData,
    });
  }
}
