import { StatusCodes } from "http-status-codes";
import messageHelper from "../../helpers/message.helper";
import { ordersService } from "../../services/v1/orders.service";
import { IOrderDocument } from "../../models/orders.schema";
import { createOrderSchema } from "../../schemes/order";

export class OrdersController {
  /**
   * @swagger
   * /api/v1/orders:
   *   post:
   *     summary: Create new order
   *     tags:
   *       - Orders
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               pizzaItems:
   *                 type: array
   *                 items:
   *                    type: object
   *                    properties:
   *                      pizzaId:
   *                        type: number
   *                      quantity:
   *                        type: number
   *               deliveryAddress:
   *                  type: string
   *     responses:
   *       '200':
   *         description: User registered successfully
   */
  public static async createOrder(req: Request | any, res: Response | any) {
    const currentUser: number = req.currentUser.userId;
    const { pizzaItems, deliveryAddress } = req.body;
    const { error } = await Promise.resolve(
      createOrderSchema.validate(req.body)
    );
    if (error?.details) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: true, message: error.details[0].message });
      return;
    }
    try {
      const createdOrder: IOrderDocument | undefined =
        await ordersService.createOrder(
          currentUser,
          pizzaItems,
          deliveryAddress
        );
      if (createdOrder) {
        return res.status(StatusCodes.OK).json({
          error: false,
          message: messageHelper.CREATE_ORDER_SUCCESS,
          data: createdOrder,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: false,
          message: messageHelper.CREATE_ORDER_FAILED,
          data: createdOrder,
        });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: messageHelper.CREATE_ORDER_ERROR,
      });
    }
  }
  /**
   * @swagger
   * /api/v1/orders/user/{userId}:
   *   get:
   *     summary: Get all orders of user
   *     tags:
   *       - Orders
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '200':
   *         description: Successfully getting orders
   */
  public static async getAllOrdersOfUser(
    req: Request | any,
    res: Response | any
  ) {
    try {
      const orders = await ordersService.getAllOrdersOfUser(req.params.userId);
      return res.status(StatusCodes.OK).json({
        error: false,
        message: messageHelper.GET_ALL_ORDERS_SUCCESS,
        data: orders,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: messageHelper.GET_ALL_ORDERS_ERROR,
      });
    }
  }
  /**
   * @swagger
   * /api/v1/orders/{id}:
   *   get:
   *     summary: Get order details by orderId
   *     tags:
   *       - Orders
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '200':
   *         description: Successfully getting order details
   */
  public static async getOrderDetailsByOrderId(
    req: Request | any,
    res: Response | any
  ) {
    const currentUser: number = req.currentUser.userId;
    const { id } = req.params;
    try {
      const orderDetails = await ordersService.getOrderDetailsByOrderId(
        currentUser,
        id
      );
      return res.status(StatusCodes.OK).json({
        error: false,
        message: messageHelper.GET_ORDER_DETAILS_BY_ID_SUCCESS,
        data: orderDetails,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: messageHelper.GET_ORDER_DETAILS_BY_ID_ERROR,
      });
    }
  }
}
