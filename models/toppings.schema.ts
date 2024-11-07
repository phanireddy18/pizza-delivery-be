import { sequelize } from "../database";
import { DataTypes, Model, Optional } from "sequelize";

// The AddressModel model stores the address of the user
export interface IToppingsDocument {
  toppingId: number;
  name: string;
  price: number;
}
type ToppingCreationAttributes = Optional<IToppingsDocument, "toppingId">;

class ToppingModel
  extends Model<IToppingsDocument, ToppingCreationAttributes>
  implements IToppingsDocument
{
  public toppingId!: number;
  public name!: string;
  public price!: number;
}

ToppingModel.init(
  {
    toppingId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "toppings",
    timestamps: true,
  }
);

export { ToppingModel };
