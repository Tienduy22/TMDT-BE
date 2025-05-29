const userRoutes = require("./user.route");
const orderRoutes = require("./order.route")
const cartRoutes = require("./cart.route")

module.exports = (app) => {
    const PATH_API = "/api/v1/client";

    app.use(PATH_API + "/user", userRoutes)

    app.use(PATH_API + "/order", orderRoutes)

    app.use(PATH_API + "/cart", cartRoutes)

}