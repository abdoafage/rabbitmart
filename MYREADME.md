# Technical Implementation Details

## Optimizations Implemented

### 1. Database Indexing

- Added indexes on `Product` table for `area` and `category` columns to improve query performance
- This significantly speeds up filtering and searching operations
- we can cache it with some critirias format with short TTL to increase performance, Redis or memcache will help here. (short TTL because update products in cache and user does not notice that there are changes or feel with bad experiences).

### 2. Efficient Top Products Query

- Implemented raw SQL query instead of Prisma's query builder for the top products endpoint, becase shortcut the time will spen in Prisma's query builder.
- Query optimized to use indexes effectively.
- we can cache it too but long TTL if you will show the top products for user each day, you can make it shorter but you do not need ti do this.

### 3. Request Validation

- Implemented DTOs with class-validator for robust input validation.
- Added data transformation using class-transformer to sanitize inputs.
- Example: Trimming whitespace from string inputs and detect is empty or not.

### 4. Error Handling

- Implemented global exception filter for consistent error responses.
- Added specific handling for Prisma database errors, we can add more or can spefic each enpoint with some error handlers.
- Proper HTTP status codes for different error scenarios.

## Future Improvements

### Query Optimization

- Consider materialized views for complex aggregations can used in top product and get all product endpoints.
- Implement cursor-based pagination instead of offset pagination.
- we also can use Clustered Index if we will show last product added, it will increase performance.

### API.

- Include rate limiting to prevent some attacks like DDOS

### Testing.

- Add more unit tests for edge cases
- Implement performance benchmark tests
- Add integration tests for database operations

### Why Global Exception Filter?

- Consistent error response format
- and I don't have a time to make more than one ^\_^.

### Some notes and thoughts came to my head.

- we can also apply the raw SQL query in getAllProduct and that will make it faster.
- we can add load balancer.
- we can make the VMs and databases closer to reduce network load time.

## How to run the code.

```bash
docker run --name prisma-postgres -e POSTGRES_USER=prisma -e POSTGRES_PASSWORD=prisma -e POSTGRES_DB=prisma -p 5432:5432 -d postgres
```

```bash
yarn install
yarn run prisma:generate
yarn run migrate:dev
yarn run seed
yarn run build
yarn run start:prod
```

### Endpoints:

Get all products example.

```bash
curl  -X GET \
  'localhost:8080/products?page=1&categories=Product%20187%20Category' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)'
```

Get top ranked products.

```bash
curl  -X POST \
  'localhost:8080/products/top-products' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "area":"Giza",
  "count":10
}'
```

Get single product.

```bash
curl  -X GET \
  'localhost:8080/products/70002' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)'
```

Create new product.

```bash
curl  -X POST \
  'localhost:8080/products' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "name":"milk",
  "category":"drinks",
  "area":"Maadi"
}'
```

Delete product.

```bash
curl  -X DELETE \
  'localhost:8080/products/70002' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)'
```

Update product data.

```bash
curl  -X PATCH \
  'localhost:8080/products/70001' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "name":"milk70001",
  "category":"drinks70001",
  "area":"Maadi70001"
}'
```

Create new Order.

```bash
curl  -X POST \
  'localhost:8080/orders' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --header 'Content-Type: application/json' \
  --data-raw '[
  {
    "quantity": 2,
    "productId": 70000
  },
  {
    "quantity": 2,
    "productId": 70003
  }
]'
```

Get all Orders.

```bash
curl  -X GET \
  'localhost:8080/orders' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)'
```
