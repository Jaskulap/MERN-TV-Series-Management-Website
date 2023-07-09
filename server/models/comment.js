const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nick: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", commentSchema);

const validateComment = (comment) => {
  const schema = Joi.object({
    tresc: Joi.string().trim().required().empty().messages({
      'string.empty': '!!Content is required!!',
    }).label("Tresc")
  });

  return schema.validate(comment);
};



module.exports = { Comment,validateComment};
