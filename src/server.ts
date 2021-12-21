import http from "http";
import { app } from "./app";
import { Server, Socket } from "socket.io"
import { shared } from "shared";
import { checkWinner } from "utils/checkWinner";
import { isGameOver } from "utils/isGameOver";

const httpServer = http.createServer(app)

const io = new Server(httpServer);

// io.use((socket, next) => {
//     const token = socket.request.headers.cookie?.split(";")[0].split("=")[1];
//     const refreshToken = socket.request.headers.cookie?.split(";")[1].split("=")[1];

//     if (jwt.verify(token, "SECRET_KEY")) {
//         socket.emit("JWT_EXPIRED")
//     }
//     next();
// })


io.on("connection", (socket) => {
    console.log("New client connected with ID " + socket.id);

    socket.on("loggedIn", ({ name, symbol }: { name: string, symbol: "X" | "O" }) => {
        console.log(name + " is waiting for a game...")

        socket.on("disconnect", () => {
            console.log("Client " + socket.id + " disconnected");
            shared.waitingList[symbol] = shared.waitingList[symbol].filter(u => u.socket.id !== socket.id)
        });

        socket.on("leave", () => {
            console.log("Client " + socket.id + " disconnected");
            shared.waitingList[symbol] = shared.waitingList[symbol].filter(u => u.socket.id !== socket.id)
        });

        const opponentSymbol = symbol === "X" ? "O" : "X";

        console.log({ opponentSymbol })

        if (shared.waitingList[opponentSymbol].length === 0) {
            shared.waitingList[symbol].push({ name, socket })

            socket.emit("waitingForOpponent")
        } else {
            const user = shared.waitingList[opponentSymbol].shift()!
            const [symbol1, symbol2] = Math.random() >= 0.5 ? ["X", "O"] : ["O", "X"]

            user.socket.emit("gameStarted", {
                name: name,
                socketId: socket.id,
                symbol: symbol1,
            })

            socket.emit("gameStarted", {
                name: user.name,
                socketId: user.socket.id,
                symbol: symbol2
            })
        }
    })

    socket.on("matrixUpdate", ({ matrix, opponent }) => {
        console.log({ matrix }, opponent)

        // check if the game is over
        const winner = checkWinner(matrix)

        if (!winner) {
            const gameIsOver = isGameOver(matrix)

            if (gameIsOver) {
                // this is a draw
                socket.emit("gameOver", { winner, matrix })
            } else {
                // the game is not over yet
                socket.emit("waitingForMove")
                socket.to(opponent.socketId).emit("yourTurn", { matrix })
            }
        } else {
            socket.emit("gameOver", { winner, matrix })
            socket.to(opponent.socketId).emit("gameOver", { winner, matrix })
        }

        // socket.to(opponent.socketId).emit("hello")
    })


})

export { httpServer }