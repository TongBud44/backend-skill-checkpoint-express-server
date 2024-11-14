import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateAnswerPost } from "../middlewares/answerValidation.mjs";

const answersRouter = Router();

// POST สร้าง answers ให้แต่ละ question
answersRouter.post(
  "/:questionId/answers",
  [validateAnswerPost],
  async (req, res) => {
    const questionIdFromClient = req.params.questionId;
    const newAnswer = {
      ...req.body,
    };
    try {
      const questionResult = await connectionPool.query(
        `select 1 from questions where id = $1`,
        [questionIdFromClient]
      );

      //rowCount แสดงจำนวนแถวที่ query คืนกลับมา
      // ในเคสนี้ ถ้านับจำนวนแถวที่มี id ตรงกับเงื่อนไขแล้วเท่ากับ 0 ก็คือไม่มี id นั้นอยู่ ก็ให้ return กลับมาว่า 404
      if (questionResult.rowCount === 0) {
        return res.status(404).json({
          message: "Question not found.",
        });
      }

      await connectionPool.query(
        `insert into answers(question_id, content)
        values($1, $2)`,
        [questionIdFromClient, newAnswer.content]
      );
    } catch (error) {
      return res.status(500).json({
        message: "Unable to create answers.",
      });
    }

    return res.status(201).json({
      message: "Answer created successfully.",
    });
  }
);

// GET answers ของแต่ละ question
answersRouter.get("/:questionId/answers", async (req, res) => {
  const questionIdFromClient = req.params.questionId;
  let results;

  try {
    results = await connectionPool.query(
      `select questions.id as Question-ID, answers.id as Answer-ID, answers.content as Content
      from answers
      inner join questions 
      on questions.id = answers.question_id
      where questions.id = $1`,
      [questionIdFromClient]
    );
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch answers." });
  }

  return res.status(200).json({
    data: results.rows,
  });
});

export default answersRouter;
