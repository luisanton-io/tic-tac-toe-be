import express from 'express'
import cors from 'cors'
import { shared } from './shared'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/waiting', (req, res) => {
    res.send({
        "X": shared.waitingList["X"].map(u => ({
            ...u, socket: undefined,
            socketId: u.socket.id
        })),
        "O": shared.waitingList["O"].map(u => ({
            ...u, socket: undefined,
            socketId: u.socket.id
        }))
    })
})


export { app }