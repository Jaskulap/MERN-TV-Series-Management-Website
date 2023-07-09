const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const serialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imdb: { type: Number, required: true },
  tag: { type: String, required: true },
  averageMinutes: { type: Number, required: true },
  episodes: [{
    episodeTitle: { type: String }
  }]
});

const Serial = mongoose.model("Serial", serialSchema);

const validate = (serial) => {
  const schema = Joi.object({
    title: Joi.string().required().label("Title"),
    description: Joi.string().required().label("Description"),
    imdb: Joi.number().required().label("IMDb"),
    tag: Joi.string().required().label("Tag"),
    averageMinutes: Joi.number().required().label("Average Minutes"),
    //imagePanel: Joi.binary().required().label("Image Panel"),
    //imageMain: Joi.binary().required().label("Image Main"),
    episodes: Joi.array().items(
      Joi.object({
        episodeTitle: Joi.string().required().label("Episode Title"),
      })
    ),
  });
  return schema.validate(serial);
};


module.exports = { Serial, validate };
