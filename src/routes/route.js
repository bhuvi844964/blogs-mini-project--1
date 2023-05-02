const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const commonMiddleware = require("../middleware/auth");

//---------------------------------------------------------------//

//...........................Author..............................//

router.post("/authors", authorController.createAuthor);

router.post("/login", authorController.login);

//...........................Blog...............................//

router.post(
  "/blogs",
  commonMiddleware.authentication,
  blogController.createBlog
);

router.get("/blogs", commonMiddleware.authentication, blogController.getBlogs);

router.put(
  "/blogs/:blogId",
  commonMiddleware.authentication,
  commonMiddleware.authorization,
  blogController.update
);

//...........................Delete.............................//

router.delete(
  "/blogs/:blogId",
  commonMiddleware.authentication,
  commonMiddleware.authorization,
  blogController.deleteByBlogId
);

router.delete(
  "/blogs",
  commonMiddleware.authentication,
  blogController.deleteByQuery
);

//............................................................//

module.exports = router;
