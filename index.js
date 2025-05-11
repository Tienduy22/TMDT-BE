const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const database = require("./config/database");
const routeAdmin = require("./api/v1/routes/admin/index.route");
const routeClient = require("./api/v1/routes/client/index.route");

database.connect();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3001',  // Cho phép tất cả các domain
    credentials: true,
}));

routeAdmin(app);
routeClient(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})