const Order = require('../Models/ordersModel');
const Payment = require('../Models/paymentModel');
const { payByWaafiPay } = require("../paymen"); // Ensure the correct file path




// exports.createOrder = async (req, res) => {
//     try {
//         const { paymentName, paymentPhone, totalprice, ...orderData } = req.body;
//         const payment = await Payment.findOne({ name: paymentName }); // Find payment method

//         if (!payment) {
//             return res.status(400).send({ error: 'Invalid payment method' });
//         }

//         if (paymentName === "CASH") {
//             const order = new Order({ ...orderData, payment: payment._id, paymentPhone, totalprice });
//             await order.save();
//             res.status(201).send(order);
//         } else {
//             const waafiResponse = await payByWaafiPay({
//                 phone: paymentPhone,
//                 amount: totalprice,
//                 merchantUid: process.env.merchantUid,
//                 apiUserId: process.env.apiUserId,
//                 apiKey: process.env.apiKey
//             });

//             if (waafiResponse.status) {
//                 const order = new Order({ ...orderData, payment: payment._id, paymentPhone, totalprice });
//                 await order.save();
//                 res.status(201).send(order);
//             } else {
//                 return res.status(400).send({
//                     status: "failed",
//                     message: waafiResponse.error || "Payment Failed. Try Again."
//                 });
//             }
//         }
//     } catch (error) {
//         res.status(400).send({ error: error.message || "Something went wrong" });
//     }
// };
exports.createOrder = async (req, res) => {
    try {
        const { paymentName, paymentPhone, totalprice, ...orderData } = req.body;
        const payment = await Payment.findOne({ name: paymentName });

        if (!payment) {
            return res.status(400).send({ error: 'Invalid payment method' });
        }

        if (paymentName === "CASH") {
            const order = new Order({ ...orderData, payment: payment._id, paymentPhone, totalprice });
            await order.save();
            res.status(201).send(order);
        } else {
            const waafiResponse = await payByWaafiPay({
                phone: paymentPhone,
                amount: totalprice,
                merchantUid: process.env.merchantUid,
                apiUserId: process.env.apiUserId,
                apiKey: process.env.apiKey
            });

            if (typeof waafiResponse === 'string') {
                try {
                    waafiResponse = JSON.parse(waafiResponse);
                } catch (error) {
                    return res.status(500).send({ error: 'Invalid response from WaafiPay' });
                }
            }

            if (waafiResponse.status) {
                const order = new Order({ ...orderData, payment: payment._id, paymentPhone, totalprice });
                await order.save();
                res.status(201).send(order);
            } else {
                return res.status(400).send({
                    status: "failed",
                    message: waafiResponse.error || "Payment Failed. Try Again."
                });
            }
        }
    } catch (error) {
        res.status(400).send({ error: error.message || "Something went wrong" });
    }
};
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('orderItems.product', 'name price');
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message || "Something went wrong" });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('orderItems.product', 'name price');
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message || "Something went wrong" });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.status(200).send(order);
    } catch (error) {
        res.status(400).send({ error: error.message || "Something went wrong" });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message || "Something went wrong" });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ user: userId })
            .populate('user', 'name email')
            .populate('orderItems.product', 'name price');
        if (orders.length === 0) {
            return res.status(404).send({ message: 'No orders found for this user.' });
        }
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message || "Something went wrong" });
    }
};
