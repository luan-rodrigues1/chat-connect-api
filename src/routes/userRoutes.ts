import express, { Router } from "express";
import userController from "../controllers/UserController";

export class UserRoutes {

    public router: Router = express.Router();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("", userController.createUser);
        this.router.get("/:userId", userController.userById)
        this.router.post("/login", userController.login);
    }

    getRouter() {
        return this.router;
    }
}

const userRoute = new UserRoutes().getRouter()

export default userRoute