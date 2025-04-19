const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");

require("dotenv").config();
const database = require("./config/database");
const route = require("./api/v1/routes/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
route(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})