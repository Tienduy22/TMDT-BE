const Order = require("../../models/order.model");

//[POST] /api/v1/client/order/paypal-transaction-complete
module.exports.paypalComplete = async (req,res) => {
    const order = new Order(req.body)
    await order.save()

    res.status(200).json({ 
        code: 200,
        message: 'Lưu thông tin đơn hàng thành công'
    });
} 

//[GET] /api/v1/client/order/:userId
module.exports.getOrderOfUser = async(req,res) => {
    try {
        const userId = req.params.userId
        const email = req.params.email
        const phone = req.params.phone
        let find = {}
        if(userId){
            find = {
                userId: userId
            }
        } else {
            find = {
                "infoUser.name" : email,
                "infoUser.phone" : phone
            }
        }
        const listOrderUser = await Order.find(find)

        res.status(200).json({
            listOrderUser: listOrderUser
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}


//[GET] /api/v1/client/order
module.exports.getOrder = async(req,res) => {
    try {
        const orders = await Order.find()
        if(!orders){
            res.status(400).json({
                message: "Chưa có đơn hàng"
            })
        } else {
            res.status(200).json({
                orders
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

//[GET] /api/v1/client/order/detail/:order_id
module.exports.getOrderDetail = async(req,res) => {
    try {
        const {order_id} = req.params;
        const order = await Order.findById(order_id);
        if(order){
            res.status(200).json({
                order
            })
        } else {
            res.status(400).json({
                message: "Đơn hàng không tồn tại"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

//[PATCH] /api/v1/client/order/edit/:order_id
module.exports.getOrderEdit = async(req,res) => {
    try {
        const {order_id} = req.params;
        const status = req.body.status;
        await Order.updateOne({_id:order_id},{
            status: status
        })
        const order = await Order.findById(order_id);
        res.status(200).json({
            code:200,
            message: "Cập nhật thành công",
            order
        })
    } catch (error){
        res.status(500).json({
            message: error
        })
    }
}


//[DELETE] /api/v1/client/order/edit/:order_id
module.exports.getOrderDelete = async(req,res) => {
    try {
        const {order_id} = req.params;
        await Order.deleteOne({_id:order_id})
        res.status(200).json({
            code: 200,
            message: "Xóa đơn hàng thành công"
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}