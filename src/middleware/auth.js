const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");

module.exports.tokenChecker = async function (req, res, next) {
  try {
    const token = req.headers['x-api-key'];
    if (!token) {
      return res
        .status(401)
        .send({ status: false, message: 'Missing authentication token in request' });
    }

    jwt.verify(token, 'This-is-a-secret-key', function (err, decoded) {
      if (err) {
        return res.status(401).send({ status: false, message: 'Token invalid' });
      } else {
        req.authorId = decoded.authorId;
        return next();
      }
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.authorization = async function (req, res, next) {
  try {
    let blogId = req.params.blogId;

    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).send({ status: false, msg: "Please enter blogID as a valid ObjectId" });
    }
    let findBlog = await blogModel.findById(blogId);
    if (findBlog) {
      if (req.authorId != findBlog.authorId) {
        return res.status(403).send({ status: false, msg: "Author is not authorized to access this data" });
      } else {
        next();
      }
    } else {
      return res.status(404).send({ status: false, msg: "Blog not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};
