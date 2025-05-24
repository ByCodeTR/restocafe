# RestoCafe API Documentation

This document outlines all available API endpoints and Socket.IO events in the RestoCafe system.

## Base URL

All API endpoints are prefixed with `/api`

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Auth Endpoints

#### Register New User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Access**: Admin only
- **Description**: Creates a new user account
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string",
    "role": "string"
  }
  ```

#### User Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Description**: Authenticates a user and returns JWT token
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

#### Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns current user's profile information

#### Update Profile
- **URL**: `/auth/profile`
- **Method**: `PUT`
- **Access**: Authenticated users
- **Description**: Updates user's profile information

### Table Endpoints

#### List All Tables
- **URL**: `/tables`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns list of all tables

#### Get Table Details
- **URL**: `/tables/:id`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns detailed information about a specific table

#### Create New Table
- **URL**: `/tables`
- **Method**: `POST`
- **Access**: Admin only
- **Description**: Creates a new table

#### Update Table
- **URL**: `/tables/:id`
- **Method**: `PUT`
- **Access**: Admin only
- **Description**: Updates table information

#### Delete Table
- **URL**: `/tables/:id`
- **Method**: `DELETE`
- **Access**: Admin only
- **Description**: Deletes a table

#### Update Table Status
- **URL**: `/tables/:id/status`
- **Method**: `PATCH`
- **Access**: Authenticated users
- **Description**: Updates table status

#### Assign Waiter
- **URL**: `/tables/:id/assign`
- **Method**: `PATCH`
- **Access**: Admin, Manager
- **Description**: Assigns a waiter to a table

### Category Endpoints

#### List Categories
- **URL**: `/categories`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns list of all categories

#### Get Category Tree
- **URL**: `/categories?tree=true`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns hierarchical category structure

#### Get Category Details
- **URL**: `/categories/:id`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns detailed information about a specific category

#### Create Category
- **URL**: `/categories`
- **Method**: `POST`
- **Access**: Admin only
- **Description**: Creates a new category

#### Update Category
- **URL**: `/categories/:id`
- **Method**: `PUT`
- **Access**: Admin only
- **Description**: Updates category information

#### Delete Category
- **URL**: `/categories/:id`
- **Method**: `DELETE`
- **Access**: Admin only
- **Description**: Deletes a category

#### Reorder Categories
- **URL**: `/categories/reorder`
- **Method**: `PATCH`
- **Access**: Admin only
- **Description**: Updates category order

### Product Endpoints

#### List Products
- **URL**: `/products`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns list of all products
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `category`: Filter by category
  - `search`: Search term

#### List Low Stock Products
- **URL**: `/products/low-stock`
- **Method**: `GET`
- **Access**: Admin, Manager
- **Description**: Returns products with low stock levels

#### Get Product Details
- **URL**: `/products/:id`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns detailed information about a specific product

#### Create Product
- **URL**: `/products`
- **Method**: `POST`
- **Access**: Admin only
- **Description**: Creates a new product

#### Update Product
- **URL**: `/products/:id`
- **Method**: `PUT`
- **Access**: Admin only
- **Description**: Updates product information

#### Delete Product
- **URL**: `/products/:id`
- **Method**: `DELETE`
- **Access**: Admin only
- **Description**: Deletes a product

#### Update Product Stock
- **URL**: `/products/:id/stock`
- **Method**: `PATCH`
- **Access**: Admin, Manager
- **Description**: Updates product stock level

### Order Endpoints

#### List Orders
- **URL**: `/orders`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns list of orders
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `status`: Filter by status
  - `date`: Filter by date

#### Get Daily Order Summary
- **URL**: `/orders/summary/daily`
- **Method**: `GET`
- **Access**: Admin, Manager
- **Description**: Returns daily order statistics

#### Get Order Details
- **URL**: `/orders/:id`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns detailed information about a specific order

#### Create Order
- **URL**: `/orders`
- **Method**: `POST`
- **Access**: Waiter, Admin
- **Description**: Creates a new order

#### Update Order Item Status
- **URL**: `/orders/:id/items/:itemId/status`
- **Method**: `PATCH`
- **Access**: Waiter, Kitchen, Admin
- **Description**: Updates status of a specific order item

#### Add Payment to Order
- **URL**: `/orders/:id/payments`
- **Method**: `POST`
- **Access**: Waiter, Cashier, Admin
- **Description**: Adds payment to an order

#### Cancel Order
- **URL**: `/orders/:id/cancel`
- **Method**: `PATCH`
- **Access**: Waiter, Admin
- **Description**: Cancels an order

### Reservation Endpoints

#### List Reservations
- **URL**: `/reservations`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns list of reservations
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `date`: Filter by date
  - `status`: Filter by status

#### Get Reservation Details
- **URL**: `/reservations/:id`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns detailed information about a specific reservation

#### Create Reservation
- **URL**: `/reservations`
- **Method**: `POST`
- **Access**: Authenticated users
- **Description**: Creates a new reservation

#### Update Reservation
- **URL**: `/reservations/:id`
- **Method**: `PATCH`
- **Access**: Authenticated users
- **Description**: Updates reservation information

#### Cancel Reservation
- **URL**: `/reservations/:id/cancel`
- **Method**: `PATCH`
- **Access**: Authenticated users
- **Description**: Cancels a reservation

#### Check Available Tables
- **URL**: `/tables/available`
- **Method**: `GET`
- **Access**: Authenticated users
- **Description**: Returns list of available tables for reservation
- **Query Parameters**:
  - `date`: Date
  - `time`: Time
  - `duration`: Duration in minutes
  - `guests`: Number of guests

## Socket.IO Events

### Server Events (Emit)

#### New Order
- **Event**: `newOrder`
- **Description**: Emitted when a new order is created
- **Data**:
  ```json
  {
    "orderId": "string",
    "tableId": "string",
    "items": [],
    "timestamp": "string"
  }
  ```

#### Order Status Update
- **Event**: `orderStatusUpdate`
- **Description**: Emitted when order status changes
- **Data**:
  ```json
  {
    "orderId": "string",
    "itemId": "string",
    "status": "string",
    "updatedBy": "string",
    "timestamp": "string"
  }
  ```

## Error Responses

All endpoints follow a standard error response format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error 