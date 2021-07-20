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
        /* createdAtは省略して良い(自動で時刻を追加 経過ミリ秒) */
        const app = await prismaClient.app.create({data: {id: Math.random().toString(32).substring(2), name: req.body.name}});
        return res.status(201).json({app: app});
    } catch (e) {
        console.log(e);
        return res.status(500);
    }
});

app.delete("/app", async (req: Request, res: Response) => {
    try {
        const app = await prismaClient.app.delete({where: {id: req.body.id}});
        return res.status(200).json({app: app});
    } catch (e) {
        console.log(e);
        return res.status(500);
    }
});

app.get("/transition", async (req: Request, res: Response) => {
    try {
        const states = await prismaClient.state.findMany({where: {appId: req.body.id}});
        const actions = await prismaClient.action.findMany({where: {appId: req.body.id}});
        const transitions = await prismaClient.transition.findMany({where: {appId: req.body.id}});
        console.log(states);
        return res.status(200).json({states: states, actions: actions, transitions: transitions});
    } catch (e) {
        console.log(e);
        return res.status(500);
    }
});

app.post("/state", async (req: Request, res: Response) => {
    const stateId: string = req.body.state.stateId === undefined ? Math.random().toString(32).substring(2) : req.body.state.stateId;
    try {
        console.log(req.body.state)
        const state = await prismaClient.state.upsert({where: {stateId: stateId}, create: {...req.body.state, stateId: stateId}, update: {name: req.body.state.name}});
        return res.status(201).json({state: state});
    } catch (e) {
        console.log(e);
        return res.status(500);
    }
});

app.post("/action", async (req: Request, res: Response) => {
    const actionId: string = req.body.state.actionId === undefined ? Math.random().toString(32).substring(2) : req.body.state.actionId;
    try {
        const state = await prismaClient.action.upsert({where: {actionId: actionId}, create: {...req.body.action, actionId: actionId}, update: {name: req.body.action.name}});
        return res.status(201).json({state: state});
    } catch (e) {
        console.log(e);
        return res.status(500);
    }
});

module.exports = {
    path: "/api",
    handler: app
}