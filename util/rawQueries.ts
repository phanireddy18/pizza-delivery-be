export var GET_ALL_ORDER_DETAILS_BY_USER_ID = `  SELECT 
          o."orderId", 
          o."userId", 
          o."deliveryAddress", 
          o."totalPrice", 
          o.status,
          o."createdAt",
          op."pizzaId", 
          op.quantity as "pizzaQuantity",
          p.name as "pizzaName",
          p.price as "pizzaPrice"
        FROM orders o
        LEFT JOIN order_items op ON o."orderId" = op."orderId"
        LEFT JOIN pizzas p ON op."pizzaId" = p."pizzaId"
        WHERE o."userId" = :userId
        ORDER BY o."createdAt" DESC;`;

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
        LEFT JOIN order_items op ON o."orderId" = op."orderId"
        LEFT JOIN pizzas p ON op."pizzaId" = p."pizzaId"
        WHERE o."userId" = :userId AND o."orderId" = :orderId
        ORDER BY o."createdAt"  DESC;`;
