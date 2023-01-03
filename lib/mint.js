const mongoose = require("mongoose");
const mint = new mongoose.Schema({
    from: {
        type: String,
    },
    to: {
        type: String,
    }
});

module.exports = mongoose.models.Mint || mongoose.model("Mint", mint);

