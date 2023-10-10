import express from "express"
import { Server, createServer } from "http"
import {Server as Io} from "socket.io"
import userRoute from "./routes/userRoutes"
import { Socket } from 'socket.io-client';
import cors from 'cors'

class App {
    public app: express.Application
    public server: Server
    private socketIo: Io
    private userSockets: Map<string, Socket>;

    constructor () {
        this.app = express()
        this.app.use(express.json());
        this.app.use(cors())
        this.server = createServer(this.app)
        this.socketIo = new Io(this.server, {
            cors: {
                origin: "*"
            }
        })

        this.app.use("/users", userRoute);

        // this.socketIo.on("connection", socket => {
        //     socket.on("disconnect", () => {
        //         console.log("usuário desconectado")
        //     })

        //     socket.on("message", (message) => {
        //         this.socketIo.emit('message', message)
        //     })
        // })

        this.userSockets = new Map()

        this.socketIo.on("connection", (socket: any) => {
            console.log("Usuário conectado")
            socket.on("login", (userId: string) => {
                console.log("usuário logado", userId)
                this.userSockets.set(userId, socket)
            })

            socket.on("logout", (userId: string) => {
                console.log("usuário deslogado", userId)
                this.userSockets.delete(userId);
            })
    
            socket.on("disconnect", (userId: string) => {
                console.log("Usuário desconectado");
            });
        })


    }
    

    // private removeSocket(socket: Socket) {
    //     this.userSockets.forEach((value, key) => {
    //         if (value === socket) {
    //             this.userSockets.delete(key);
    //         }
    //     });
    // }

}

export default App