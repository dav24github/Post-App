const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

console.log(process.env.MONGO_ATLAS_PW);
console.log(process.env.JWT_KEY);
mongoose
  .connect(
    "mongodb://David_atlas:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0-shard-00-00.tbj07.mongodb.net:27017,cluster0-shard-00-01.tbj07.mongodb.net:27017,cluster0-shard-00-02.tbj07.mongodb.net:27017/node-angular?ssl=true&replicaSet=atlas-vxzmm6-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log("Connection failed!", error);
  });

app.use(express.json());

app.use("/images", express.static(path.join(process.cwd(), "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
