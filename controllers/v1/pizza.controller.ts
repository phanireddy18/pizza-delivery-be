import { StatusCodes } from "http-status-codes";
import messageHelper from "../../helpers/message.helper";
import { PizzaModel } from "../../models/pizza.schema";

export class PizzaController {
  public static async getAllPizzas(req: Request | any, res: Response | any) {
    try {
      const pizzaDetails: any = await PizzaModel.findAll({
        where: {
          isActive: true,
        },
      });
      return res.status(StatusCodes.OK).json({
        error: false,
        message: "Successfully getting pizza details",
        data: pizzaDetails,
      });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: "error occured while getting pizza detials",
      });
    }
  }
}
