
# 🛒 API de Carrito de Compras

Esta API permite gestionar un carrito de compras con funcionalidades como agregar, editar y eliminar artículos.

## 🚀 Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   ```

2. **Instalar dependencias:**
   ```bash
   rm -rf node_modules     
   npm cache clean --force
   npm install
   ```

3. **Iniciar el servidor:**
   ```bash
   docker-compose build dev-env                           
   docker-compose up dev-env
   ```
   La API estará disponible en `http://localhost:81`.

---

## 📌 Endpoints de la API

### 🔐 1. Registro de Usuario  
📌 **Método:** `POST`  
📌 **URL:** `http://localhost:81/signup`  
📌 **Body (Insomnia - JSON):**
```json
{
  "username": "juanperez",
  "email": "juanperez@example.com",
  "password": "ClaveSegura123!",
  "confirmPassword": "ClaveSegura123!"
}
```
📌 **Respuesta exitosa (201):**
```json
{
  "message": "User registered successfully"
}
```

---

### 🔑 2. Iniciar Sesión  
📌 **Método:** `POST`  
📌 **URL:** `http://localhost:81/login`  
📌 **Body (Insomnia - JSON):**
```json
{
  "email": "juanperez@example.com",
  "password": "ClaveSegura123!"
}
```
📌 **Respuesta exitosa (200):**
```json
{
  "message": "Verification code sent",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🛒 3. Obtener los artículos del carrito  
📌 **Método:** `GET`  
📌 **URL:** `http://localhost:81/cart/67ee1d0954192fd47a11214d`  
📌 **Respuesta exitosa (200):**
```json
{
  "cartItems": [
    {
      "productId": "65445e83e1b4d51d570c9e8c",
      "quantity": 3
    },
    {
      "productId": "65445e83e1b4d51d570c9e9d",
      "quantity": 5
    }
  ]
}
```

---

### ➕ 4. Agregar un artículo al carrito  
📌 **Método:** `POST`  
📌 **URL:** `http://localhost:81/cart`  
📌 **Body (Insomnia - JSON):**
```json
{
  "userId": "67ee1d0954192fd47a11214d",
  "productId": "65445e83e1b4d51d570c9e8c",
  "quantity": 2
}
```
📌 **Respuesta exitosa (201):**
```json
{
  "_id": "someCartItemId",
  "userId": "67ee1d0954192fd47a11214d",
  "productId": "65445e83e1b4d51d570c9e8c",
  "quantity": 2
}
```

---

### ➕ 5. Agregar múltiples artículos al carrito  
📌 **Método:** `POST`  
📌 **URL:** `http://localhost:81/multiplecart`  
📌 **Body (Insomnia - JSON):**
```json
{
  "userId": "67ee1d0954192fd47a11214d",
  "cartItems": [
    {
      "productId": "65445e83e1b4d51d570c9e8c",
      "quantity": 10
    },
    {
      "productId": "65445e83e1b4d51d570c9e9d",
      "quantity": 15
    }
  ]
}
```
📌 **Respuesta exitosa (201):**
```json
[
  {
    "_id": "someCartItemId",
    "userId": "67ee1d0954192fd47a11214d",
    "productId": "65445e83e1b4d51d570c9e8c",
    "quantity": 10
  },
  {
    "_id": "someOtherCartItemId",
    "userId": "67ee1d0954192fd47a11214d",
    "productId": "65445e83e1b4d51d570c9e9d",
    "quantity": 15
  }
]
```

---

### ✏️ 6. Editar la cantidad de un artículo en el carrito  
📌 **Método:** `PUT`  
📌 **URL:** `http://localhost:81/cart/67ee1d0954192fd47a11214d/65445e83e1b4d51d570c9e8c`  
📌 **Body (Insomnia - JSON):**
```json
{
  "quantity": 8
}
```
📌 **Respuesta exitosa (200):**
```json
{
  "_id": "someCartItemId",
  "userId": "67ee1d0954192fd47a11214d",
  "productId": "65445e83e1b4d51d570c9e8c",
  "quantity": 8
}
```

---

### ❌ 7. Eliminar un artículo del carrito  
📌 **Método:** `DELETE`  
📌 **URL:** `http://localhost:81/cart/67ee1d0954192fd47a11214d/65445e83e1b4d51d570c9e8c`  
📌 **Respuesta exitosa (200):**
```json
{
  "message": "Cart item deleted successfully"
}
```

---

### ❌ 8. Vaciar el carrito  
📌 **Método:** `DELETE`  
📌 **URL:** `http://localhost:81/cart/67ee1d0954192fd47a11214d`  
📌 **Respuesta exitosa (200):**
```json
{
  "message": "All cart items deleted successfully"
}
```

---
 📜 The liko API REST Users