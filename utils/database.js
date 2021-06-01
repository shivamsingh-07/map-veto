const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://abstergo:shivam123@userauthentication.nzpai.mongodb.net/MapVeto?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => {
        console.log("Database connected...");
    }
);
