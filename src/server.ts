import App from "./app";

const app = new App()

app.server.listen(8080, () => {
    console.log("Server is running in Port localhost:8080")
})