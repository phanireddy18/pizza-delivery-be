import { sequelize } from "../../database";
import { OrderItemsModel } from "../../models/orderItems.schema";
import {
  IOrderDocument,
  OrderModel,
  OrderStatus,
} from "../../models/orders.schema";
import { PizzaModel } from "../../models/pizzas.schema";
import * as QUERIES from "../../util/rawQueries";
import { Transaction } from "sequelize/types";

class OrdersService {
  async createOrder(
    userId: number,
    pizzaItems: { pizzaId: number; quantity: number }[],
    deliveryAddress: string
  ): Promise<IOrderDocument | undefined> {
    //Start Transaction
    const transactionObj: Transaction = await sequelize.transaction();
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
      const order: IOrderDocument = await OrderModel.create(
        {
          userId,
          deliveryAddress,
          totalPrice,
          status: OrderStatus.PENDING, // Default status
        },
        {
          transaction: transactionObj,
        }
      );

      // Add pizza items to the order (using the orderId created above)
      const pizzaItemPromises = pizzaItems.map((item) =>
        OrderItemsModel.create(
          {
            orderId: order.orderId,
            pizzaId: item.pizzaId,
            quantity: item.quantity,
          },
          {
            transaction: transactionObj,
          }
        )
      );

      // Wait for all pizza items to be created
      await Promise.all(pizzaItemPromises);
      await transactionObj.commit();
      return order;
    } catch (error) {
      await transactionObj.rollback();
      console.error("Error creating order:", error);
    }
  }

  async getAllOrdersForUser(userId: number): Promise<any[]> {
    try {
      // Execute the raw query to get all orders for the user, with pizza details
      const [results, metadata]: [any, any] = await sequelize.query(
        QUERIES.GET_ALL_ORDER_DETAILS_BY_USER_ID,
        {
          replacements: {
            userId,
          },
        }
      );

      // If no results are found, return an empty array
      if (!results || results.length === 0) {
        return [];
      }

      // Structure the results to group pizzas by orderId
      const ordersMap: { [key: number]: any } = {};

      results.forEach((item: any) => {
        const {
          orderId,
          userId,
          deliveryAddress,
          totalPrice,
          status,
          pizzaId,
          pizzaQuantity,
          pizzaName,
          pizzaPrice,
        } = item;

        // If the order is not already in the map, initialize it
        if (!ordersMap[orderId]) {
          ordersMap[orderId] = {
            orderId,
            userId,
            deliveryAddress,
            totalPrice,
            status,
            pizzas: [],
          };
        }

        // Add the pizza details to the pizzas array for the specific order
        ordersMap[orderId].pizzas.push({
          pizzaId,
          pizzaQuantity,
          pizzaName,
          pizzaPrice,
        });
      });

      // Convert the orders map to an array of orders
      const orders = Object.values(ordersMap);

      return orders;
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
