const router = require("express").Router();
const { Serial } = require("../models/serial");
const tokenVerification = require("../middleware/tokenVerification");

router.get("/", async (req, res) => {
    Serial.find().exec().then(async () => {
            const serials = await Serial.find();
            res.status(200).send({ data: serials, message: "Lista seriali" });
        })
        .catch(error => {
            res.status(500).send({ message: error.message });
        });
})

router.get("/:title", async (req, res) => {
    const { title } = req.params;
  
    try {
      const serial = await Serial.findOne({ title });
  
      if (!serial) {
        return res.status(404).send({ message: "Serial not found" });
      }
  
      res.status(200).send({ data: serial, message: "Serial details" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  
module.exports = router;
