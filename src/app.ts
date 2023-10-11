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
        this.server = createServer(this.app)
        this.app.use(cors())
        this.socketIo = new Io(this.server, {
            cors: {
                origin: "*"
            }
        })
        
        this.app.use("/users", userRoute);

        this.userSockets = new Map()

        this.socketIo.on("connection", (socket: any) => {
            console.log("Usuário conectado")
            socket.on("login", (userId: string) => {
                this.userSockets.set(userId, socket)
                const serachSocket = this.userSockets.get(userId);
                
                console.log("search new 2", userId, serachSocket?.id)
            })

            socket.on("message", (text: string) => {
                this.socketIo.emit("message", text); 
            })

            socket.on("message2", ({senderId, recipientId, content}: {senderId: string, recipientId: string, content: string}) => {

                socket.to(recipientId).emit("message", {
                    senderId,
                    message: content
                });
                 
            })

            socket.on("privateMessage", ({ senderId, recipientId, content }: {senderId: string, recipientId: string, content: string}) => {

                const recipientSocket = this.userSockets.get(recipientId);

                console.log(recipientSocket?.id)

                console.log("chegou aqui", senderId, recipientId, content)
                console.log(recipientSocket?.id)

                if (recipientSocket) {
                    console.log("enviando mensagem", senderId, content)
                    recipientSocket.emit("privateMessage", { senderId, content });

                    // console.log(teste, "mensagem enviada")
                } else {
                    
                    console.log("O destinatário não está online");
                }
                
            });

            socket.on("logout", (userId: string) => {
                console.log("usuário deslogado", userId)
                this.userSockets.delete(userId);
            })
    
            socket.on("disconnect", (userId: string) => {
                console.log("Usuário desconectado");
            });
        })


    }

}

export default App