# Pizza Ordering Service

## Overview

This application allows users to place pizza orders, manage orders, and retrieve order details. It is built with a focus on handling pizza customization and tracking orders in a transactional system.

## Key Features

- **List of pizzas**: Retrieve a list of all available pizzas.
- **Pizza details**: Retrieve detailed information about a specific pizza, including its name, price, and description.
- **Create an order**: Users can place an order with multiple pizzas.
- **Order details**: Retrieve details of an order, including the pizza names, quantities, and total price.
- **User-specific orders**: Orders are associated with a specific user and can be fetched by `userId`.
- **Authentication**: JWT-based authentication to secure endpoints.

## Project Structure

- **models/**: Contains Sequelize models for Pizza, Order, OrderItems, and associated schemas.
- **Controllers/**: Includes the business logic for creating and fetching orders.
- **database/**: Contains database initialization and configuration.
- **queries/**: Includes raw SQL queries used for specific database operations (like fetching order details).

## Setup and Installation

### Prerequisites

- Node.js
- Sequelize (ORM) and PostgreSQL
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

## Authentication

- This API uses **JWT (JSON Web Token)** for user authentication to protect certain endpoints. While **login** and **signup** endpoints do not require a **JWT token** (as they are used to authenticate users and generate the token), **protected endpoints** do require a valid JWT token to access.

## How JWT Authentication Works

1. **Login & Signup (No JWT required)**
   To authenticate, you first use the login or signup endpoints, which do not require JWT tokens. After successful login, the API will return a JWT token, which you will use to authenticate subsequent requests.

2. **Use the JWT Token for Protected Routes**
   Once you receive a JWT token from a successful login, include it in the Authorization header when accessing protected API endpoints, such as viewing pizza details or accessing user-specific resources.

Example of how to pass the token:

```
Authorization: Bearer <your_jwt_token_here>

```

## Notes

- No toppings: In this version of the application, we do not track toppings. The customization is limited to pizza type and quantity.
- Transaction Management: All order creations are wrapped in transactions to ensure atomicity, meaning either all operations succeed or none.
