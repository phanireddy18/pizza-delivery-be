import { sequelize } from "../database";
import { DataTypes, Model, Optional } from "sequelize";

export interface IUserDocument {
  userId: number;
  username: string;
  email: string;
  password: string;
  address: string;
  isActive?: boolean;
}

type UserCreationAttributes = Optional<IUserDocument, "userId">;

// Define the User model class
class UserModel
  extends Model<IUserDocument, UserCreationAttributes>
  implements IUserDocument
{
  public userId!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public address!: string;
  public isActive?: boolean;
}

UserModel.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);
export { UserModel };
