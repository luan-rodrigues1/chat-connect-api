import { Socket } from "dgram"
import e from "express"
import express from "express"
import { Server, createServer } from "http"
import {Server as Io} from "socket.io"

class App {
    public app: express.Application
    public server: Server
    private socketIo: Io

    constructor () {
        this.app = express()
        this.server = createServer(this.app)
        this.socketIo = new Io(this.server, {
            cors: {
                origin: "*"
            }
        })

        this.socketIo.on("connection", socket => {
            console.log("usuario conectado")

            socket.on("disconnect", () => {
                console.log("usuário desconectado")
            })

            socket.on("message", (message) => {
                console.log(message)
                this.socketIo.emit('message', message)
            })
        })
    }

    
}

export default App