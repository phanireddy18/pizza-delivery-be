import { sequelize } from "../database";
import { DataTypes, Model, Optional } from "sequelize";

// Enum for order status
export enum OrderStatus {
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
}

export interface IOrderDocument {
  orderId: number;
  userId: number;
  totalPrice: number;
  deliveryAddress: string;
  status: OrderStatus;
}

type OrderCreationAttributes = Optional<IOrderDocument, "orderId">;

// Define the Order model class
class OrderModel
  extends Model<IOrderDocument, OrderCreationAttributes>
  implements IOrderDocument
{
  public orderId!: number;
  public userId!: number;
  public totalPrice!: number;
  public deliveryAddress!: string;
  public status!: OrderStatus;
}

OrderModel.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(OrderStatus.PENDING, OrderStatus.DELIVERED),
      allowNull: false,
      defaultValue: OrderStatus.PENDING,
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true,
  }
);

export { OrderModel };
