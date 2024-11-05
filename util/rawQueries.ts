export var GET_ORDER_DETAILS_BY_ORDER_ID = `  SELECT 
          o."orderId", 
          o."userId", 
          o."deliveryAddress", 
          o."totalPrice", 
          o.status,
          op."pizzaId", 
          op.quantity as "pizzaQuantity",
          p.name as "pizzaName",
          p.price as "pizzaPrice"
        FROM orders o
        LEFT JOIN order_pizzas op ON o."orderId" = op."orderId"
        LEFT JOIN pizzas p ON op."pizzaId" = p."pizzaId"
        WHERE o."userId" = :userId AND o."orderId" = :orderId
        ORDER BY o."orderId"  DESC;`;
