import { sequelize } from "../database";
import { DataTypes, Model } from "sequelize";

// The OrderItemsModel model stores the relationship between Orders and Pizza items
export interface IOrderPizzaDocument {
  orderId: number;
  pizzaId: number;
  quantity: number;
}

class OrderItemsModel
  extends Model<IOrderPizzaDocument>
  implements IOrderPizzaDocument
{
  public orderId!: number;
  public pizzaId!: number;
  public quantity!: number;
}

OrderItemsModel.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders", // This refers to the orders table
        key: "orderId",
      },
    },
    pizzaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pizzas", // This refers to the pizzas table
        key: "pizzaId",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    tableName: "order_items",
    timestamps: false, // No timestamps for this join table
  }
);

export { OrderItemsModel };
