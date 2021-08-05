import express, { Request, Response } from "express";
import { Question } from "./../types/quiz";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const prisma = new PrismaClient();

app.post("/user", (req: Request, res: Response) => {
    const name: string = req.body.name === "" ? "名無し" : req.body.name;
    return res.status(200).json({id: Math.random().toString(32).substring(2), name: name});
});

app.get("/quiz", (_, res: Response) => {

    let questions: Question[] = [];
    let status: number = 200;

    try {
        /* ルートディレクトリからの相対パス */
        const json = JSON.parse(fs.readFileSync("./static/quiz.json", "utf-8"));
        let selected: {[key: string]: any};
        questions = questions.concat(
            [...Array(10)].map((): Question => {
                selected = json.questions[Math.floor(Math.random() * json.questions.length)];
                json.questions = json.questions.filter((obj: {[key: string]: any}) => obj.qid !== selected.qid);
                return {qid: selected.qid, content: selected.question, answer: selected.answer_entity, candidates: selected.answer_candidates} 
            })
        );
    } catch (e) {
        console.log(e);
        status = 500;
    }

    res.status(status).json({questions: questions});

});

module.exports = {
    path: "/api",
    handler: app
}