/* eslint-disable no-console */
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// Configuring the db connection
const connectionStr = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// connection to the database hosted on atlas of mongodb
mongoose
  .connect(connectionStr, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  });

// order is a must
const app = require("./app");

// console.log(process.env);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server Started Running");
});
