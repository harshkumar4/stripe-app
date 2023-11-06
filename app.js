require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const v1Routes = require("./src/v1/routes");

const app = express();

const mongoDbUsername = process.env.MONGO_USERNAME;
const mongoDbPassword = process.env.MONGO_PASSWORD;

app.use(express.json());
app.use(morgan("dev"));

app.use("/v1", v1Routes);

const port = process.env.PORT;

mongoose
  .connect(
    `mongodb+srv://${mongoDbUsername}:${mongoDbPassword}@stripe-app.pikuo9t.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((value) => {
    app.listen(port, () => console.log(`Listening on port ${port}!`));
  });
