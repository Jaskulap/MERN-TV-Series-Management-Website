const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  nick: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  serials: [
    {
      title: { type: String, required: true },
      watchedEpisodes: [{ type: Number }]
    }
  ]
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

const validate = (user) => {
  const schema = Joi.object({
    nick: Joi.string().required().label("Nick"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(user);
};

/*const validateSerial = (serial) => {
  const schema = Joi.object({
    title: Joi.string().required().label("Title"),
    episodeCount: Joi.number().required().label("Episode Count"),
    watchedEpisodes: Joi.array().items(Joi.number()).label("Watched Episodes"),
  });
  return schema.validate(serial);
};
*/

module.exports = { User, validate};
