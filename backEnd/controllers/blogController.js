const Joi = require("joi");
const fs = require("fs");
const Blog = require("../models/blog");
const { BACKEND_SERVER_PATH } = require("../config/index");
const BlogDTO = require("../DTOs/blog");
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
      next(error);
    }

    const { title, content, photo, author } = req.body;

    //read as buffer

    const buffer = Buffer.from(
      photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    // allot a random name

    const imagePath = `${date.now()}-${author}.png`;

    // save locally - first we create a folder on root, named as storage. then we import fs here.
    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      next(error);
    }

    // now we save the data to db, and for that we need to import model of blog first
    let newBlog;
    try {
      newBlog = new Blog({
        title,
        content,
        author,
        photoPath: `BACKEND_SERVER_PATH/storage/${imagePath}`,
      });

      await newBlog.save();
    } catch (error) {
      next(error);
    }

    // need to import a blogDTO for the response.

    const blogDto = new BlogDTO(newBlog);

    return res.status(201).json({ blog: blogDto });
  },
  async getAll(req, res, next) {},
  async getById(req, res, next) {},
  async update(req, res, next) {},
  async delete(req, res, next) {},
};

module.exports = blogController;
