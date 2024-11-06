import { sequelize } from "../database";
import { DataTypes, Model, Optional } from "sequelize";

// The AddressModel model stores the address of the user
export interface IAddressDocument {
  addressId: number;
  userId: number;
  address: string;
}
type AddressCreationAttributes = Optional<IAddressDocument, "addressId">;

class AddressModel
  extends Model<IAddressDocument, AddressCreationAttributes>
  implements IAddressDocument
{
  public addressId!: number;
  public userId!: number;
  public address!: string;
}

AddressModel.init(
  {
    addressId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // This refers to the users table
        key: "userId",
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "address",
    timestamps: true,
  }
);

export { AddressModel };
