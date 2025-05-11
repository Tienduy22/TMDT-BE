const userRoutes = require("./user.route");

module.exports = (app) => {
    const PATH_API = "/api/v1/client";

    app.use(PATH_API + "/user", userRoutes)

}