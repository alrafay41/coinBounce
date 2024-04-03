const Joi = require("joi");
const fs = require("fs");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { BACKEND_SERVER_PATH } = require("../config/index");
const BlogDTO = require("../DTOs/blog");
const BlogDetailsDTO = require("../DTOs/blogDetails");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const blogController = {
  async create(req, res, next) {
    //1. validate req body, if we see blog model, we have title, content, photopath, author
    //2. handle photo storage,naming
    //3. save to db
    //4. return response

    // from client's side, we send photo in base64 encoded string, then we decode it in backend, then we store it and save the photo's path in db

    const createBlogSchema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      photo: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattern).required(), // the regex here should match with the id pattern of mongoDB
    });

    const { error } = createBlogSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { title, content, photo, author } = req.body;

    //read as buffer

    const buffer = Buffer.from(
      photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    // allot a random name

    const imagePath = `${Date.now()}-${author}.png`;

    // save locally - first we create a folder on root, named as storage. then we import fs here.
    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      return next(error);
    }

    // now we save the data to db, and for that we need to import model of blog first
    let newBlog;
    try {
      newBlog = new Blog({
        title,
        content,
        author,
        photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
      });

      await newBlog.save();
    } catch (error) {
      return next(error);
    }

    // need to import a blogDTO for the response.

    const blogDto = new BlogDTO(newBlog);

    return res.status(201).json({ blog: blogDto });
  },
  async getAll(req, res, next) {
    try {
      const blogs = await Blog.find({});

      // to mold it according to dto we use for loop
      const blogsDto = [];

      for (i = 0; i < blogs.length; i++) {
        const dto = new BlogDTO(blogs[i]);
        blogsDto.push(dto);
      }
      return res.status(200).json({ blogs: blogsDto });
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    // validate id
    // send response
    const getIdSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = getIdSchema.validate(req.params);

    if (error) {
      return next(error);
    }
    const { id } = req.params;
    let blog;
    try {
      blog = await Blog.findOne({ _id: id }).populate("author");
    } catch (error) {
      return next(error);
    }

    const blogDetailsDto = new BlogDetailsDTO(blog);

    return res.status(200).json({ blog: blogDetailsDto });
  },
  async update(req, res, next) {
    // validate
    // if we are updating photo, then we delete previous photo

    const updateBlogSchema = Joi.object({
      title: Joi.string(),
      content: Joi.string(),
      photo: Joi.string(),
      author: Joi.string().regex(mongodbIdPattern).required(),
      blogId: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = updateBlogSchema.validate(req.body);

    if (error) {
      next(error);
    }

    const { title, content, photo, author, blogId } = req.body;

    let blog;

    try {
      blog = await Blog.findOne({ _id: blogId });
    } catch (error) {
      return next(error);
    }

    if (photo) {
      let previousPhoto = blog.photoPath; // the previousPhoto is found in the blog, as we have used findOne method.
      previousPhoto = previousPhoto.split("/").at(-1);

      // delete photo

      fs.unlinkSync(`storage/${previousPhoto}`);

      // read as buffer

      const buffer = Buffer.from(
        photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      // allot a random name

      const imagePath = `${date.now()}-${author}.png`;

      // save locally.
      try {
        fs.writeFileSync(`storage/${imagePath}`, buffer);
      } catch (error) {
        return next(error);
      }

      await Blog.updateOne(
        { _id: blogId },
        {
          title,
          content,
          photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
        }
      );
    } else {
      await Blog.updateOne({ _id: blogId }, { title, content });
    }

    return res.status(200).json({ message: "Blog updated Successfully!" });
  },
  async delete(req, res, next) {
    //validate id
    //delete blog
    //delete comments on that blog

    const deleteIdSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = deleteIdSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { id } = req.params;

    try {
      await Blog.deleteOne({ _id: id });
      // to delete comments on that blog, we need to import comments model
      await Comment.deleteMany({ blog: id });
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({ message: "Blog Deleted Successfully!" });
  },
};

module.exports = blogController;
