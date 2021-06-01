const mongoose = require("mongoose");

mongoose.connect("<mongo-url>", { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log("Database connected...");
});
