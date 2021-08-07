import express, { Request, Response } from "express";
import { Question } from "./../types/quiz";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const prisma = new PrismaClient();

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
    });
});

app.post("/quiz/hint", async (req: Request, res: Response) => {
    try {
        await prisma.hint.create({data: {questionId: req.body.question_id, content: req.body.content}});
        return res.status(201);
    } catch (e) {
        console.log(e);
        return res.status(500);
    }
});

module.exports = {
    path: "/api",
    handler: app
}