const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user_id: String,
        cart_id: String,
        userInfo: {
            fullName: String,
            email: String,
            phone: String,
            address: String,
        },
        status: String,
        products: [
            {
                product_id: String,
                quantity: Number,
                price: Number,
                discountpercentage: Number,
            }
        ],
        deleted: {
            type: Boolean,
            default : false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;