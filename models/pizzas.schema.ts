import { sequelize } from "../database";
import { DataTypes, Model, Optional } from "sequelize";

enum size {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}
export interface IPizzaDocument {
  pizzaId: number;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  imageUrl: string;
  size: size;
  isActive?: boolean;
}

type PizzaCreationAttributes = Optional<IPizzaDocument, "pizzaId">;

// Define the Pizza model class
class PizzaModel
  extends Model<IPizzaDocument, PizzaCreationAttributes>
  implements IPizzaDocument
{
  public pizzaId!: number;
  public name!: string;
  public description!: string;
  public longDescription!: string;
  public price!: number;
  public imageUrl!: string;
  public size!: size;
  public isActive?: boolean;
}

PizzaModel.init(
  {
    pizzaId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    size: {
      type: DataTypes.ENUM(size.SMALL, size.MEDIUM, size.LARGE),
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
    tableName: "pizzas",
    timestamps: true,
  }
);
export { PizzaModel };
