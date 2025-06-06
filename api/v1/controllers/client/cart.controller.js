const Cart = require("../../models/cart.model");

// [GET] api/v1/cart/:userId
module.exports.cart = async (req, res) => {
    try {
        const user_id = req.params.userId;
        const cart = await Cart.findOne({ user_id });
        if (cart) {
            res.status(200).json({
                cart,
            });
        } else {
            const cart = new Cart({
                user_id: user_id,
                products: [],
            });

            await cart.save();

            res.status(200).json({
                cart,
            });
        }
    } catch (error) {
        console.log(error);
    }
};


// [PATCH] cart/upadte/:userId
module.exports.update = async (req, res) => {
    try {
        const user_id = req.params.userId;

        const product = req.body.product;

        console.log(product.product_id);

        let newProduct = {
            product_id: "",
            name: "",
            image: "",
            amount: 0,
            price: 0,
        };

        newProduct.product_id = product.product_id;
        newProduct.name = product.name;
        newProduct.image = product.image;
        newProduct.amount = product.amount;
        newProduct.price = product.price;

        let check = 0;

        const cart = await Cart.findOne({ user_id: user_id });

        if (!cart) {
            res.status(400).json({
                message: "Not found cart",
            });
        }

        cart.products.forEach((item) => {
            if (item.product_id === product.product_id) {
                item.amount += product.amount;
                check = 1;
            }
        });

        if (check == 0) {
            console.log(newProduct);
            cart.products.push(newProduct);
        }

        await cart.save();

        res.status(200).json({
            cart,
        });
    } catch (error) {
        console.log(error);
    }
};

// [DELETE] cart/delete/:userId
module.exports.delete = async (req, res) => {
    try {
        const userId = req.params.userId;

        const { productId } = req.body;

        console.log("OKJ")


        const cart = await Cart.findOne({
            user_id: userId,
        });

        if (!cart) {
            res.status(400).json({
                message: "Not found cart",
            });
        } else {
            cart.products = cart.products.filter(
                (item) => item.product_id !== productId
            );
            await cart.save();
            res.status(200).json({
                message: "Success deleted",
            });
        }
    } catch (error) {
        console.log(error);
    }
};
