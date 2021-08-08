import express, { Request, Response } from "express";
import { Question } from "./../types/quiz";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/quiz", (req: Request, res: Response) => {

    let questions: Question[] = [];
    let status: number = 200;

    try {
        /* ルートディレクトリからの相対パス */
        const json = JSON.parse(fs.readFileSync("./static/quiz.json", "utf-8"));
        let selected: {[key: string]: any};
        questions = questions.concat(
            /* クエリは渡された値の方に関係なく文字列型になるので元に戻す */
            [...Array(Number(req.query.num))].map((): Question => {
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

module.exports = {
    path: "/api",
    handler: app
}