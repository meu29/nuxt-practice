import express, { Request, Response } from "express";
import { prismaClient } from "./../prisma/client";

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/app", async (_, res: Response) => {
    try {
        const apps = await prismaClient.app.findMany();
        return res.status(200).json({apps: apps});
    } catch (e) {
        console.log(e);
        return res.status(500);
    }
});

app.post("/app", async (req: Request, res: Response) => {
    try {
        /* createdは省略して良い(自動で時刻を追加 経過ミリ秒) */
        const app = await prismaClient.app.create({data: {id: Math.random().toString(32).substring(2), name: req.body.name}});
        return res.status(201).json({app: app});
    } catch (e) {
        console.log(e);
        return res.status(500);
    }
});

module.exports = {
    path: "/api",
    handler: app
}