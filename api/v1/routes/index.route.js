const productRoutes = require("./product.route")

module.exports = (app) => {
    const PATH_API = "/api/v1";

    app.use(PATH_API + "/products", productRoutes)
}