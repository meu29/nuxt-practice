import express, { Request, Response } from "express";
import { Question } from "./../types/quiz";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const prisma = new PrismaClient();

app.post("/user", (req: Request, res: Response) => {
    const selected: {[key: string]: true} = {id: true, password: true}
    try {
        let user = prisma.user.findFirst({where: {email: req.body.email, password: req.body.password}, select: selected});
        if (req.body.new_user === true) {
            if (user !== null) {
                /* 作成したリソースが既に存在する場合(登録済みのメールアドレスで登録しようとした時) */
                return res.status(409);
            } else {
                user = prisma.user.create({data: {id: Math.random().toString(32).substring(2), name: req.body.name, email: req.body.email, password: req.body.password}, select: selected});
                return res.status(201).json({user: user});
            }
        } else {
            if (user === null) {
                res.status(404);
            } else {
                res.status(200).json({user: user});
            }
        }
    } catch (e) {
        console.log(e);
        return res.status(500);
    }
});

app.get("/quiz", (_, res: Response) => {

    let questions: Question[] = [];
    let status: number = 200;

    try {
        /* ルートディレクトリからの相対パス */
        const json = JSON.parse(fs.readFileSync("./static/quiz.json", "utf-8"));
        let selected: {[key: string]: any};
        questions = questions.concat(
            [...Array(5)].map((): Question => {
                selected = json.questions[Math.floor(Math.random() * json.questions.length)];
                json.questions = json.questions.filter((obj: {[key: string]: any}) => obj.qid !== selected.qid);
                return {id: selected.qid, content: selected.question, answer: selected.answer_entity, candidates: selected.answer_candidates} 
            })
        );
    } catch (e) {
        console.log(e);
        status = 500;
    }

    res.status(status).json({questions: questions});

});

app.get("/quiz/hint", (req: Request, res: Response) => {
    return res.status(200).json({
        hints: [...Array(10)].map((_, index: number) => req.query.id + "のヒント" + (index + 1).toString() + "は〇〇〇〇〇〇〇〇〇〇〇〇です")
    })
});

module.exports = {
    path: "/api",
    handler: app
}