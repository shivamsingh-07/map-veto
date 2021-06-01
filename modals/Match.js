const mongoose = require("mongoose");

const matchSchema = mongoose.Schema({
    name: String,
    room_id: String,
    player_1: String,
    player_2: String,
    player_1_joined: { type: Boolean, default: false },
    player_2_joined: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
    start_time: { type: String, default: "" },
    map_selected: {
        type: [String],
        default: ["de_cache", "de_cbble", "de_dust2", "de_inferno", "cs_italy", "de_mirage", "de_nuke", "cs_office", "de_overpass", "de_train", "de_vertigo"],
    },
    turn: { type: String, default: "" },
});

module.exports = mongoose.model("matches", matchSchema);
