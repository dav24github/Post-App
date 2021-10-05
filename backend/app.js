const express = require("express");

const app = express();

app.use("/api/post", (req, res, next) => {
  const posts = [
    {
      id: "1",
      title: "First server-side post",
      content: "This is coming from the serve",
    },
    {
      id: "2",
      title: "Second server-side post",
      content: "This is coming from the serve",
    },
  ];
  res.status(200).json({
    message: "Post fetched successfully!",
    posts: posts,
  });
});

module.exports = app;
