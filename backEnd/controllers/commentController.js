const Joi = require("joi");
const Comment = require("../models/comment");
const CommentDTO = require("../DTOs/comment");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const commentController = {
  async create(req, res, next) {
    //validate
    const createCommentSchema = Joi.object({
      content: Joi.string().required(),
      blog: Joi.string().regex(mongodbIdPattern).required(),
      author: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = createCommentSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { content, blog, author } = req.body;

    try {
      const newComment = new Comment({ content, blog, author });
      await newComment.save();
    } catch (error) {
      return next(error);
    }

    return res.status(201).json({ message: "comment created" });
  },
  async getById(req, res, next) {
    //validate blog id

    const getIdSchema = new Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });
    const { error } = getIdSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { id } = req.params;
    let comment;
    try {
      comment = await Comment.find({ blog: id }).populate("author"); //getting data by blogId
    } catch (error) {
      return next(error);
    }

    let comments = [];
    for (let i = 0; i < comment.length; i++) {
      const dto = new CommentDTO(comment[i]);
      comments.push(dto);
    }

    return res.status(200).json({ comment: comment });
  },
};

module.exports = commentController;
