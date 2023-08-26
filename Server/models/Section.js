const mongoose = require("mongoose");
const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
  },
  sectionName: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubSection",
    },
  ],
});

module.exports = mongoose("Section", sectionSchema);
