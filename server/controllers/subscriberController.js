const Subscriber = require("../models/Subscriber");

exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Already subscribed" });
    }
    await Subscriber.create({ email });
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    next(error);
  }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    await Subscriber.findOneAndDelete({ email: req.params.email });
    res.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    next(error);
  }
};
