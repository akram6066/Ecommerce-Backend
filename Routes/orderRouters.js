const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/ordersController.js'); // Adjust the path as necessary

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);

// Get orders by user ID
router.get('/user/:userId', orderController.getOrdersByUserId); // Ensure the URL parameter is consistent

// Update an order
router.put('/:id', orderController.updateOrder);

// Delete an order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
