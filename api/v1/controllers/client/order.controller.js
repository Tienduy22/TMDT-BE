//[POST] /api/v1/order/paypal-transaction-complete

const Order = require("../../models/order.model");

module.exports.paypalComplete = async (req,res) => {
    const { orderID } = req.body;

    // Xử lý thông tin giao dịch, ví dụ như lưu vào cơ sở dữ liệu
    console.log(req.body);

    const order = new Order(req.body)
    await order.save()

    res.status(200).send({ 
        code: 200,
        message: 'Lưu thông tin đơn hàng thành công'
    });
} 