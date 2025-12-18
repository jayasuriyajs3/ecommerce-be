the database name is ecommerce# Havox E-commerce Express Backend API

This Express.js backend provides REST APIs for managing products and shopping cart functionality using file-based storage (JSON files).

## 📁 Project Structure

```
express_proj/
├── server.js           # Main Express server
├── products.json       # Products database (JSON file)
├── cart.json          # Cart database (JSON file)
├── routes/
│   ├── products.js    # Product routes (CRUD operations)
│   └── cart.js        # Cart routes (CRUD operations)
├── package.json
└── README.md
```

## 🚀 Getting Started

### Installation

1. Navigate to the express_proj folder:
```bash
cd express_proj
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## 📡 API Endpoints

### Products API

#### 1. **GET /products**
Fetch all products from products.json

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Air Max Pro",
      "price": "8999",
      "description": "Premium running shoes",
      "image": "https://..."
    }
  ]
}
```

#### 2. **GET /products/:id**
Fetch a single product by ID

**Response:**
```json
{
  "product": {
    "id": 1,
    "name": "Air Max Pro",
    "price": "8999",
    "description": "Premium running shoes",
    "image": "https://..."
  }
}
```

#### 3. **POST /products**
Add a new product (Admin only)

**Request Body:**
```json
{
  "name": "New Shoe",
  "price": "5999",
  "description": "Comfortable sneakers",
  "image": "https://..."
}
```

**Response:**
```json
{
  "message": "Product added successfully",
  "product": { ... }
}
```

#### 4. **PUT /products/:id**
Update an existing product

**Request Body:**
```json
{
  "name": "Updated Shoe Name",
  "price": "6999",
  "description": "Updated description",
  "image": "https://..."
}
```

**Response:**
```json
{
  "message": "Product updated successfully",
  "product": { ... }
}
```

#### 5. **DELETE /products/:id**
Delete a product

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

---

### Cart API

#### 1. **GET /cart**
Fetch all items in the cart

**Response:**
```json
{
  "cart": [
    {
      "id": 1,
      "name": "Air Max Pro",
      "price": "8999",
      "description": "Premium running shoes",
      "image": "https://...",
      "quantity": 2
    }
  ]
}
```

#### 2. **POST /cart**
Add an item to the cart

**Request Body:**
```json
{
  "id": 1,
  "name": "Air Max Pro",
  "price": "8999",
  "description": "Premium running shoes",
  "image": "https://...",
  "quantity": 1
}
```

**Response:**
```json
{
  "message": "Item added to cart",
  "cart": [ ... ]
}
```

**Note:** If the item already exists in the cart, its quantity will be incremented.

#### 3. **PUT /cart/:id**
Update cart item quantity

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "message": "Cart item updated",
  "cart": [ ... ]
}
```

**Note:** Setting quantity to 0 will remove the item from the cart.

#### 4. **DELETE /cart/:id**
Remove an item from the cart

**Response:**
```json
{
  "message": "Item removed from cart",
  "cart": [ ... ]
}
```

---

## 🔧 Frontend Integration

### Fetching Products

```javascript
const fetchProducts = async () => {
  const response = await fetch("http://localhost:3000/products");
  const data = await response.json();
  console.log(data.products);
};
```

### Adding a Product (Admin)

```javascript
const addProduct = async (productData) => {
  const response = await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  console.log(data.message);
};
```

### Adding to Cart

```javascript
const addToCart = async (product) => {
  const response = await fetch("http://localhost:3000/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  console.log(data.message);
};
```

### Updating Cart Quantity

```javascript
const updateCartQuantity = async (productId, quantity) => {
  const response = await fetch(`http://localhost:3000/cart/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  const data = await response.json();
  console.log(data.message);
};
```

### Removing from Cart

```javascript
const removeFromCart = async (productId) => {
  const response = await fetch(`http://localhost:3000/cart/${productId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  console.log(data.message);
};
```

---

## 📝 Task Completion Checklist

✅ **Task 1:** Create APIs for cart page using file processing
- [x] Created `cart.json` for cart data storage
- [x] Implemented GET, POST, PUT, DELETE methods for cart
- [x] Cart updates persist to `cart.json` file

✅ **Task 2:** Integrate products API with frontend
- [x] Created `products.json` with initial product data
- [x] Implemented GET, POST, PUT, DELETE methods for products
- [x] Admin page (AddProductForm) posts to API
- [x] Products listing page fetches from API
- [x] Product additions update `products.json` file

✅ **Task 3:** Integrate cart API with frontend
- [x] Cart page fetches from `/cart` endpoint
- [x] Add to cart updates `cart.json`
- [x] Quantity updates persist to JSON file
- [x] Delete operations remove from JSON file

---

## 🛠️ Technologies Used

- **Express.js** - Web framework
- **fs (File System)** - File-based database using JSON
- **CORS** - Cross-Origin Resource Sharing
- **Node.js** - Runtime environment

---

## 📌 Notes

- This backend uses **file-based storage** (JSON files) instead of a traditional database
- Products and cart data persist across server restarts
- CORS is enabled for frontend integration
- All CRUD operations (Create, Read, Update, Delete) are implemented
- Error handling included for invalid requests

---

## 🎯 Future Enhancements

- Add authentication/authorization
- Implement user-specific carts
- Add order management APIs
- Migrate to MongoDB/PostgreSQL for production
- Add input validation middleware
- Implement pagination for products

---

**Server Status:** ✓ Running on http://localhost:3000
**API Documentation:** All endpoints tested and working
**Frontend Integration:** Complete
