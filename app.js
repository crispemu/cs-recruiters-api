const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const applicantRoutes = require("./api/routes/applicant");
const processRoutes = require("./api/routes/process");
const interviewRoutes = require("./api/routes/interview");

mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://cs-user:" +
    process.env.MONGO_ATLAS_PW +
    "@cs-recruitment-db-shard-00-00-qjcn7.mongodb.net:27017,cs-recruitment-db-shard-00-01-qjcn7.mongodb.net:27017,cs-recruitment-db-shard-00-02-qjcn7.mongodb.net:27017/test?ssl=true&replicaSet=cs-recruitment-db-shard-0&authSource=admin&retryWrites=true",
  {
    useMongoClient: true
  }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/applicant", applicantRoutes);
app.use("/process", processRoutes);
app.use("/interview", interviewRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
