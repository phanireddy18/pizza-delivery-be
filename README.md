# Pizza Ordering Service

## Overview

This application allows users to place pizza orders, manage orders, and retrieve order details. It is built with a focus on handling pizza customization and tracking orders in a transactional system.

## Key Features

- **List of pizzas**: Retrieve a list of all available pizzas.
- **Pizza details**: Retrieve detailed information about a specific pizza, including its name, price, and description.
- **Create an order**: Users can place an order with multiple pizzas.
- **Order details**: Retrieve details of an order, including the pizza names, quantities, and total price.
- **User-specific orders**: Orders are associated with a specific user and can be fetched by `userId`.

## Project Structure

- **models/**: Contains Sequelize models for Pizza, Order, OrderItems, and associated schemas.
- **Controllers/**: Includes the business logic for creating and fetching orders.
- **database/**: Contains database initialization and configuration.
- **queries/**: Includes raw SQL queries used for specific database operations (like fetching order details).

## Setup and Installation

### Prerequisites

- Node.js
- Sequelize (ORM) and PostgreSQL (or another SQL database)
- npm or yarn

## Installation Steps

1. Clone the repository:

```
git clone https://github.com/phanireddy18/pizza-delivery-be.git
```

2. Navigate into the project directory:

```
cd pizza-ordering-service
```

3. Install dependencies:

```
npm install
```

6. Set up the database:
   - Configure the database connection in database.ts (using Sequelize).
   - Ensure your PostgreSQL instance is running.
   - Create the required tables using Sequelize migrations.
7. Create a `.env` file in the root of the project and set the required environment variables:

```
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
```

8. Run the application

- If you are not using Docker, run the following command:

```
npm start
```

- If you have Docker installed, you can use Docker Compose to build and run the application:

```
docker-compose up --build
```

## Notes

- No toppings: In this version of the application, we do not track toppings. The customization is limited to pizza type and quantity.
- Transaction Management: All order creations are wrapped in transactions to ensure atomicity, meaning either all operations succeed or none.
