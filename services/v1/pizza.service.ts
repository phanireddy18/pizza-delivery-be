import { IPizzaDocument, PizzaModel } from "../../models/pizzas.schema";

class PizzaService {
  async getAllPizzas(): Promise<IPizzaDocument[]> {
    try {
      const allPizzas: IPizzaDocument[] = await PizzaModel.findAll({
        where: {
          isActive: true,
        },
        attributes: {
          exclude: ["description"], // Exclude the description field
        },
      });

      return allPizzas;
    } catch (error) {
      console.error(error);
      throw new Error("Error occured while getting all pizzas detials");
    }
  }

  async getPizzaById(id: number): Promise<IPizzaDocument | null> {
    try {
      const pizza: IPizzaDocument | null = await PizzaModel.findOne({
        where: {
          pizzaId: id,
          isActive: true,
        },
      });
      if (pizza) {
        return pizza;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error occured while getting all pizzas detials");
    }
  }
}

export const pizzaService: PizzaService = new PizzaService();
