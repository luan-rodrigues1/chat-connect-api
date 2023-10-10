import { Request, Response } from "express";
import { appDataSource } from "../data-source";
import { compare, hashSync } from "bcrypt";
import User from "../entities/user.entities";
import jwt from "jsonwebtoken"

export class UserController {
    async createUser(req: Request, res: Response) {

        const userRepo = appDataSource.getRepository(User)

        const existingUser = await userRepo.findOne({where: {email: req.body.email}})

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        
        req.body.password = hashSync(req.body.password, 10)
        
        const newUser = userRepo.create({...req.body} as User)

        await userRepo.save(newUser)

        const {password, ...rest} = newUser
        
        return res.status(201).json(rest);
        
    }

    async userById(req: Request, res: Response) {

        const userRepo = appDataSource.getRepository(User)

        const existingUser = await userRepo.findOne({where: {id: req.params.userId}})

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const {password, ...rest} = existingUser
        return res.status(200).json(rest)        
    }

    async login(req: Request, res: Response) {
        const userRepo = appDataSource.getRepository(User)

        const existingUser = await userRepo.findOne({where: {email: req.body.email}})

        if (!existingUser) {
            return res.status(409).json({ message: "User or password invalid" });
        }
        
        const passwordMatch = await compare(req.body.password, existingUser.password)

        if(!passwordMatch){ 
            return res.status(401).json({ message: "User or password invalid" })
        }

        const token = jwt.sign(
            {
                id: existingUser.id
            },
            process.env.SECRET_KEY as string,
            {
                expiresIn: "24h"
            }
        );
        
        return res.status(200).json({ token: token, id: existingUser.id })
        
    }

}

const userController = new UserController()

export default userController;