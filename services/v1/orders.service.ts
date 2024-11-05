import { sequelize } from "../../database";
import { OrderPizzaModel } from "../../models/orderPizza.schema";
import {
  IOrderDocument,
  OrderModel,
  OrderStatus,
} from "../../models/orders.schema";
import { PizzaModel } from "../../models/pizzas.schema";
import * as QUERIES from "../../util/rawQueries";

class OrdersService {
  // Function to create an order
  async createOrder(
    userId: number,
    pizzaItems: { pizzaId: number; quantity: number }[],
    deliveryAddress: string
  ): Promise<IOrderDocument | undefined> {
    try {
      // Fetch the pizzas to calculate total price
      const pizzas = await PizzaModel.findAll({
        where: { pizzaId: pizzaItems.map((item) => item.pizzaId) }, // Get pizzas by pizzaIds
      });

      // Calculate the total price for the order
      const totalPrice = pizzas.reduce((sum, pizza) => {
        const item = pizzaItems.find((item) => item.pizzaId === pizza.pizzaId);
        return sum + pizza.price * (item ? item.quantity : 0);
      }, 0);

      // Create the order
      const order: IOrderDocument = await OrderModel.create({
        userId,
        deliveryAddress,
        totalPrice,
        status: OrderStatus.PENDING, // Default status
      });

      // Add pizza items to the order (using the orderId created above)
      const pizzaItemPromises = pizzaItems.map((item) =>
        OrderPizzaModel.create({
          orderId: order.orderId,
          pizzaId: item.pizzaId,
          quantity: item.quantity,
        })
      );

      // Wait for all pizza items to be created
      await Promise.all(pizzaItemPromises);
      return order;
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  async getAllOrdersForUser(userId: number): Promise<IOrderDocument[]> {
    try {
      // Fetch all orders for the given userId
      const orders = await OrderModel.findAll({
        where: { userId },
      });

      // Return the orders or an empty array if no orders are found
      return orders || [];
    } catch (error) {
      console.error("Error fetching orders for user:", error);
      return [];
    }
  }

  // Function to get details of a specific order for the current user using raw SQL query
  async getOrderDetailsByOrderId(
    userId: number,
    orderId: number
  ): Promise<any | null> {
    try {
      // Execute the raw query
      const [results, metadata]: [any, any] = await sequelize.query(
        QUERIES.GET_ORDER_DETAILS_BY_ORDER_ID,
        {
          replacements: {
            userId,
            orderId,
          },
        }
      );

      // If no result is found, return null
      if (!results || results.length === 0) {
        return null;
      }

      // Process the result into a more structured format (optional)
      const order = results[0]; // Since it's a specific order, there will only be one or none
      const pizzas = results.map((item: any) => ({
        pizzaName: item.pizzaName,
        pizzaQuantity: item.pizzaQuantity,
        pizzaPrice: item.pizzaPrice,
      }));

      return {
        orderId: order.orderId,
        userId: order.userId,
        deliveryAddress: order.deliveryAddress,
        totalPrice: order.totalPrice,
        status: order.status,
        pizzas,
      };
    } catch (error) {
      console.error("Error fetching order details:", error);
      return null;
    }
  }
}

export const ordersService: OrdersService = new OrdersService();
