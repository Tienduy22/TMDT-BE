const Order = require("../../models/order.model");

//[POST] /api/v1/order/paypal-transaction-complete
module.exports.paypalComplete = async (req,res) => {
    const order = new Order(req.body)
    await order.save()

    res.status(200).json({ 
        code: 200,
        message: 'Lưu thông tin đơn hàng thành công'
    });
} 

//[GET] /api/v1/order/:userId
module.exports.getAll = async(req,res) => {
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
        console.log(error)
    }
}