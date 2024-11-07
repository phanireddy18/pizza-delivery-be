import { StatusCodes } from "http-status-codes";
import { ToppingModel } from "../../models/toppings.schema";

export class ToppingsController {
  /**
   * @swagger
   * /api/v1/toppings:
   *   get:
   *     summary: Get a list of all available toppings
   *     tags:
   *       - Toppings
   *     responses:
   *       '200':
   *         description: Successfully getting list of all available toppings.
   */
  public static async getToppings(req: Request | any, res: Response | any) {
    try {
      const toppings = await ToppingModel.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      return res.status(StatusCodes.OK).json({
        error: false,
        message: "Successfully getting list of all available toppings",
        data: toppings,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: "Error occured while getting list of all available toppings",
      });
    }
  }
}
