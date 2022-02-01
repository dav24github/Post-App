const Post = require("../models/post");
const { cloudinary } = require("../utils/cloudinary");

exports.createPosts = (req, res, next) => {
  console.log("req.body => ", req.body);
  const fileStr = req.body.imageData;
  cloudinary.uploader
    .upload(fileStr, {
      upload_preset: "dev_setups",
    })
    .then((uploadResponse) => {
      console.log("uploadResponse => ", uploadResponse);

      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: uploadResponse.public_id,
        creator: req.userData.userId,
      });

      post
        .save()
        .then((createdPost) => {
          res.status(201).json({
            message: "Post added successfully",
            post: { ...createdPost, id: createdPost._id },
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Creating post failed",
          });
        });
    })
    .catch((err) => {
      console.error("cloudinary.uploader.upload error => ", err);
      res.status(500).json({ err: "Something went wrong" });
    });
};

exports.updatePost = (req, res, next) => {
  const fileStr = req.body.imageData;
  if (typeof fileStr !== "undefined" && fileStr) {
    cloudinary.uploader
      .upload(fileStr, {
        upload_preset: "dev_setups",
      })
      .then((uploadResponse) => {
        console.log("uploadResponse => ", uploadResponse);
        const post = new Post({
          _id: req.body.id,
          title: req.body.title,
          content: req.body.content,
          imagePath: uploadResponse.public_id,
          creator: req.userData.userId,
        });
        Post.updateOne(
          { _id: req.params.id, creator: req.userData.userId },
          post
        )
          .then((result) => {
            if (result.matchedCount > 0)
              res.status(200).json({ message: "Updated successfully!" });
            else res.status(401).json({ message: "Not Authorized" });
          })
          .catch((error) => {
            res.status(500).json({
              message: "Couldn't update post",
            });
          });
      })
      .catch((err) => {
        console.error("cloudinary.uploader.upload error => ", err);
        res.status(500).json({ err: "Something went wrong" });
      });
  } else {
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      creator: req.userData.userId,
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then((result) => {
        if (result.matchedCount > 0)
          res.status(200).json({ message: "Updated successfully!" });
        else res.status(401).json({ message: "Not Authorized" });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Couldn't update post",
        });
      });
  }
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0)
        res.status(200).json({ message: "Delition successfully!" });
      else res.status(401).json({ message: "Not Authorized" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed!",
      });
    });
};
