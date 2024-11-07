import { StatusCodes } from "http-status-codes";
import messageHelper from "../../helpers/message.helper";
import { IPizzaDocument } from "../../models/pizzas.schema";
import { pizzaService } from "../../services/v1/pizza.service";

export class PizzaController {
  /**
   * @swagger
   * /api/v1/pizzas:
   *   get:
   *     summary: Get all available pizzas
   *     tags:
   *       - Pizzas
   *     responses:
   *       '200':
   *         description: Successfully getting list of all available pizzas
   */
  public static async getAllPizzas(req: Request | any, res: Response | any) {
    try {
      const allPizzas: IPizzaDocument[] = await pizzaService.getAllPizzas();
      return res.status(StatusCodes.OK).json({
        error: false,
        message: messageHelper.GET_ALL_PIZZAS_SUCCESS,
        data: allPizzas,
      });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: messageHelper.GET_ALL_PIZZAS_ERROR,
      });
    }
  }
  /**
   * @swagger
   * /api/v1/pizzas/{id}:
   *   get:
   *     summary: Get pizza details by id
   *     tags:
   *       - Pizzas
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       '200':
   *         description: Successfully getting pizza details
   */
  public static async getPizzaById(req: Request | any, res: Response | any) {
    try {
      const { id } = req.params;
      const pizza: IPizzaDocument | null = await pizzaService.getPizzaById(id);
      if (pizza) {
        return res.status(StatusCodes.OK).json({
          error: false,
          message: messageHelper.GET_ALL_PIZZA_DETAILS_BY_ID_SUCCESS,
          data: pizza,
        });
      } else {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: true,
          message: messageHelper.GET_ALL_PIZZA_DETAILS_BY_ID_NOT_FOUND,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: messageHelper.GET_ALL_PIZZA_DETAILS_BY_ID_ERROR,
      });
    }
  }
}
