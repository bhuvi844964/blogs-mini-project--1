const mongoose = require("mongoose")
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")

//---------------------------------------------------------------//

//..............2....POST /blogs API.............................//

//...............................................................//


const createBlog = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length === 0)
            return res.status(400).send({ Status: false, message: "Please provide all the required data " })

        if (!data.title || data.title == "")
            return res.status(400).send({ Status: false, message: "Please provide title of the blog " })
        else
            data.title = data.title.trim()

        if (!data.body || data.body == "")
            return res.status(400).send({ Status: false, message: "Please provide body of the blog " })
        else
            data.body = data.body.trim()

        if (!data.authorId || data.authorId == "")
            return res.status(400).send({ Status: false, message: "Please provide authorId " })
        else
            data.authorId = data.authorId.trim()

        if (!data.category || data.category == "")
            return res.status(400).send({ Status: false, message: "Please provide blog category " })
        else
            data.category = data.category.trim()

        if (!mongoose.isValidObjectId(data.authorId ))
            return res.status(400).send({ Status: false, message: "Please enter valid authorId " })

        if (data.isPublished === true)
            data.publishedAt = Date.now()

        let savedData = await blogModel.create(data)
        res.status(201).send({ status: true, msg: savedData })

    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}


//---------------------------------------------------------------//

//.........3....GET /blogs APi...................................//

//---------------------------------------------------------------//


const getBlogs = async function (req, res) {
    try {
        if (req.query.authorId) {
            if (!mongoose.isValidObjectId(req.query.authorId))
                return res.status(400).send({ Status: false, message: "Please enter valid authorId " })
        }

        let blogFound = await blogModel.find(req.query);
        let len = blogFound.length;
        let arr = [];

        for (let i = 0; i < len; i++) {
            if (blogFound[i].isDeleted == false && blogFound[i].isPublished == true)
                arr.push(blogFound[i]);
        }

        if (arr.length > 0) {
            res.status(200).send({ status: true, data: arr, count: arr.length });
        } else {
            res.status(404).send({ status: false, message: "No such blog is found " });
        }

    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}
//...............................................................//

//.................4...PUT /blogs/:blogId...API.................//

//..............................................................//


const update = async function (req, res) {
    try {
        let data = req.body
        let blogId = req.params.blogId

        if(Object.keys(data).length==0)
        return res.status(404).send({ msg: "No data for Update " })

        if(!mongoose.isValidObjectId(blogId))
        return res.status(400).send({ Status: false, message: "Please enter valid blogId " })

        let findblog = await blogModel.findById(blogId)
        if (!findblog)
            return res.status(404).send({ msg: "blogId  is invalid " })

        if (findblog.isDeleted == true)
            return res.status(404).send({ msg: "Blog is already deleted " })

        if (findblog.isDeleted == false) {
            let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, {
                $set: {
                    title: data.title,
                    body: data.body,
                    category: data.category,
                    publishedAt: Date.now(),
                    isPublished: true
                },
                $push: {
                    tags: data.tags,
                    subcategory: data.subcategory
                }
            }, { new: true, upsert: true })
            return res.status(200).send({ status: true, msg: updatedBlog })
        }

    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}


//---------------------------------------------------------------//

//....5......DELETE /blogs/:blogId API..........................//

//...............................................................//

const deleteByBlogId = async function (req, res) {
    try {
        const blogId = req.params.blogId;

        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).send({ success: false, message: "Invalid blogId" });
        }

        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(404).send({ success: false, message: "Blog not found" });
        }

        if (blog.isDeleted) {
            return res.status(200).send({ success: false, message: "Blog already deleted" });
        }


        await blogModel.findByIdAndUpdate(
            blogId,
            { isDeleted: true, deletedAt: Date.now() },
            { new: true }
        );

        res.status(200).send({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ success: false, message: "Internal server error" });
    }
};

  


//---------------------------------------------------------------//

//.....6..........DELETE /blogs?queryParams....API............//

//...............................................................//


const deleteByQuery = async function (req, res) {
    try {
        let filterdata = { isDeleted: false, authorId: req.authorId }
        let { category, subcategory, tags, authorId } = req.query

        if (authorId) {
            if (!mongoose.isValidObjectId(req.query.authorId))
                return res.status(400).send({ Status: false, message: "Please enter valid authorId " })
            else
                filterdata.authorId = authorId
        }

        if (category) {
            filterdata.category = category
        }

        if (subcategory) {
            filterdata.subcategory = subcategory
        }

        if (tags) {
            filterdata.tags = tags
        }

        let data = await blogModel.findOne(filterdata)

        if (!data)
            return res.status(404).send({ status: false, msg: "No Record Found or invalid Id " })

        let updatedData = await blogModel.updateOne(filterdata, { isDeleted: true }, { new: true })
        return res.status(200).send({ status: true, msg: "data is deleted " })

    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}

//...............................................................//

module.exports = { createBlog, getBlogs, update, deleteByBlogId, deleteByQuery }

//---------------------------------------------------------------//