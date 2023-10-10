import App from "./app";
import { appDataSource } from "./data-source";

const app = new App()

// app.server.listen(8080, () => {
//     console.log("Server is running in Port localhost:8080")
// })



appDataSource.initialize().then(() => {
    console.log("Database connected!")
    app.server.listen(8080, () => {
        console.log("Server is running in Port localhost:8080")
    })
}).catch(err => {
    console.log(err)
})