import http from "http";
import { app } from "./app";
import { Server, Socket } from "socket.io"
import { shared } from "./shared";
import { checkWinner } from "./utils/checkWinner";
import { isGameOver } from "./utils/isGameOver";

const httpServer = http.createServer(app)

const io = new Server(httpServer, { cors: { origin: "https://strive-tic-tac-toe.herokuapp.com" } });

io.on("connection", (socket) => {
    console.log("New client connected with ID " + socket.id);

    socket.on("loggedIn", ({ name, symbol }: { name: string, symbol: "X" | "O" }) => {
        console.log(name + " is waiting for a game...")

        const onDisconnect = () => {
            console.log("Client " + socket.id + " disconnected");
            try {
                shared.waitingList[symbol] = shared.waitingList[symbol].filter(u => u.socket.id !== socket.id)
            } catch (error) {
                console.log({ symbol })
                console.error(error)
            }
        }

        socket.on("disconnect", onDisconnect);

        socket.on("leave", () => {
            console.log("Client " + socket.id + " left");
            try {
                shared.waitingList[symbol] = shared.waitingList[symbol].filter(u => u.socket.id !== socket.id)
            } catch (error) {
                console.log({ symbol })
                console.error(error)
            }

            socket.off("disconnect", onDisconnect);
        });

        const opponentSymbol = symbol === "X" ? "O" : "X";

        console.log({ opponentSymbol })

        if (shared.waitingList[opponentSymbol].length === 0) {
            socket.emit("waitingForOpponent")
            try {
                shared.waitingList[symbol].push({ name, socket })
            } catch (error) {
                console.log({ symbol })
                console.error(error)
            }
        } else {
            const opponent = shared.waitingList[opponentSymbol].shift()!

            opponent.socket.emit("gameStarted", {
                opponent: {
                    name: name,
                    socketId: socket.id
                },
                symbol: opponentSymbol,
            })

            socket.emit("gameStarted", {
                opponent: {
                    name: opponent.name,
                    socketId: opponent.socket.id
                },
                symbol: symbol
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
                socket.to(opponent.socketId).emit("gameOver", { winner, matrix })
            } else {
                // the game is not over yet
                socket.emit("waitingForMove")
                socket.to(opponent.socketId).emit("yourTurn", { matrix })
            }
        } else {
            socket.emit("gameOver", { winner, matrix })
            socket.to(opponent.socketId).emit("gameOver", { winner, matrix })
        }

    })


})

export { httpServer }