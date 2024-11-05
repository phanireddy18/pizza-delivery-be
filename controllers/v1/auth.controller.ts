import { StatusCodes } from "http-status-codes";
import messageHelper from "../../helpers/message.helper";
import { signupSchema } from "../../schemes/signup";
import { omit } from "lodash";

import {
  createAuthUser,
  getUserByEmail,
  signToken,
} from "../../services/v1/auth.service";
import {
  comparePassword,
  getHashedPassword,
} from "../../helpers/password.helper";
import { firstLetterUppercase, lowerCase } from "../../helpers/email.helper";
import { signinSchema } from "../../schemes/signin";
import { IUserDocument } from "../../models/users.schema";

interface IAuthDocument {
  userId: number;
  username: string;
  email: string;
  password: string;
  address: string;
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

      const { username, email, password, address } = req.body;
      const checkIfUserExist: IAuthDocument | undefined = await getUserByEmail(
        email
      );

      if (checkIfUserExist) {
        return res.status(StatusCodes.OK).json({
          error: true,
          message: messageHelper.EMAIL_EXISTS,
        });
      }

      const hashed_password: any = await getHashedPassword(password);

      const authData: IAuthDocument = {
        username: firstLetterUppercase(username),
        email: lowerCase(email),
        password: hashed_password,
        address,
      } as IAuthDocument;

      const user: IAuthDocument = (await createAuthUser(
        authData
      )) as IAuthDocument;

      const userJWT: string = signToken(
        user.userId!,
        user.email!,
        user.username!
      );
      user.token = userJWT;
      res.status(StatusCodes.CREATED).json({
        message: messageHelper.USER_CREATE_SUCCESS,
        error: false,
        data: user,
      });
    } catch (error) {
      console.error("Error in create function:", error);
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
    const existingUser: IUserDocument | undefined = await getUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({
        message: messageHelper.USER_NOT_FOUND,
      });
    }
    const passwordsMatch = comparePassword(
      password,
      `${existingUser.password}`
    );

    if (!passwordsMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: messageHelper.INVALID_CREDENTIALS,
      });
    }
    let userJWT = "";
    let userData: Omit<IAuthDocument, "password"> | null = null;
    let message = messageHelper.LOGIN_SUCCESS;
    userJWT = signToken(
      existingUser.userId!,
      existingUser.email!,
      existingUser.username!
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
