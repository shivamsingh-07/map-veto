const socketio = require("socket.io");
const Match = require("../modals/Match");

module.exports = (server) => {
    const io = socketio(server);

    io.of("/room").on("connection", (socket) => {
        console.log("New Connection", socket.id);

        socket.on("joinRoom", (data) => {
            socket.join(data.room);
            Match.findOne({ room_id: data.room }, { __v: 0 }, (err, body) => {
                if (err) throw err;

                if (data.player === body.player_1) body.player_1_joined = true;
                else if (data.player === body.player_2) body.player_2_joined = true;

                body.save().then((res) => {
                    io.of("/room").in(data.room).emit("players", body);
                    if (res.player_1_joined && res.player_2_joined) {
                        res.start_time = new Date().toUTCString();
                        res.turn = body.player_2;
                        res.save().then(() => {
                            io.of("/room").in(data.room).emit("startVeto", 30);
                            io.of("/room").in(data.room).emit("turn", body.player_2);
                        });
                    }
                });
            });
        });

        socket.on("getPlayers", (room) => {
            Match.findOne({ room_id: room }, { _id: 0, __v: 0, player_1: 1, player_2: 1 }, (err, body) => {
                if (err) throw err;
                io.of("/room").in(room).emit("players", body);
            });
        });

        socket.on("banMap", (data) => {
            io.of("/room").in(data.room).emit("incTime");
            Match.findOneAndUpdate(
                { room_id: data.room },
                { $pull: { map_selected: data.map } },
                { new: true, useFindAndModify: false },
                (err, body) => {
                    if (err) throw err;
                    if (body.map_selected.length > 1) {
                        io.of("/room").in(data.room).emit("mapBanned", data.map);
                        if (body.turn == body.player_1) body.turn = body.player_2;
                        else body.turn = body.player_1;
                        body.save().then(() => io.of("/room").in(data.room).emit("turn", body.turn));
                    } else {
                        io.of("/room").in(data.room).emit("loading");
                        setTimeout(() => io.of("/room").in(data.room).emit("mapSelected", body.map_selected[0]), 5000);
                    }
                }
            );
        });

        socket.on("randomMap", (room) => {
            io.of("/room").in(room).emit("loading");
            try {
                Match.findOne({ room_id: room }, { map_selected: 1 }, (err, body) => {
                    if (err) throw err;
                    while (body.map_selected.length > 1) body.map_selected.splice(Math.floor(Math.random() * body.map_selected.length), 1);
                    body.save().then((res) => setTimeout(() => io.of("/room").in(room).emit("mapSelected", res.map_selected[0]), 5000));
                });
            } catch (error) {
                console.log(error);
            }
        });
    });
};
