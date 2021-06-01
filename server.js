const express = require("express");
const db = require("./utils/database");
const Match = require("./modals/Match");
const { nanoid } = require("nanoid");
const app = express();

app.set("view engine", "ejs");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", (req, res) => {
    const { name, player_1, player_2 } = req.body;

    const match = new Match({
        name,
        room_id: nanoid(),
        player_1,
        player_2,
    });
    match.save().then((data) => res.redirect(`http://localhost:5000/room/${data.room_id}`));
});

app.get("/room/:room_id", (req, res) => {
    Match.findOne({ room_id: req.params.room_id }, { __v: 0, _id: 0 }, (err, room) => {
        if (err) throw err;
        if (!room) return res.send("Invalid Room!");
        if (room.map_selected.length == 1) return res.send("Match Finished...");
        res.render("room", { room });
    });
});

const server = app.listen(5000, () => console.log("Live at 5000..."));

// Web Sockets
require("./utils/socket")(server);
