import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateQuestionPost } from "../middlewares/questionValidation.mjs";

const questionsRouter = Router();

// POST สร้าง question ใหม่เข้าไปที่ตาราง questions
questionsRouter.post("/", [validateQuestionPost], async (req, res) => {
  const newQuestion = {
    ...req.body,
  };
  try {
    await connectionPool.query(
      `insert into questions(title, description, category)
      values($1, $2, $3)`,
      [newQuestion.title, newQuestion.description, newQuestion.category]
    );
  } catch (error) {
    return res.status(500).json({
      message: "Unable to create question.",
    });
  }

  return res.status(201).json({
    message: "Question created successfully.",
  });
});

// GET question ทั้งหมดจาก database
questionsRouter.get("/", async (req, res) => {
  let results;

  try {
    results = await connectionPool.query(`select * from questions`);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }

  return res.status(200).json({
    data: results.rows,
  });
});

// Search question มี query parameter
questionsRouter.get("/search", async (req, res) => {
  const { title, category } = req.query;

  // ตรวจสอบว่าอย่างน้อยหนึ่งในสองพารามิเตอร์นี้ต้องถูกส่งมา
  if (!title && !category) {
    return res.status(400).json({
      message: "Invalid search parameters.",
    });
  }

  try {
    // สร้างเงื่อนไข SQL ตามพารามิเตอร์ที่มี
    let query = "SELECT * FROM questions WHERE ";
    const values = [];
    if (title) {
      query += "title LIKE $1 ";
      values.push(`%${title}%`);
    }
    if (category) {
      if (values.length > 0) query += "AND "; // เพิ่ม AND หากมีเงื่อนไข title อยู่แล้ว
      query += "category LIKE $2 ";
      values.push(`%${category}%`);
    }

    // ค้นหาข้อมูลในฐานข้อมูล
    const results = await connectionPool.query(query, values);
    return res.status(200).json({ data: results.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch a question.",
    });
  }
});

// GET question โดยระบุ id
questionsRouter.get("/:questionId", async (req, res) => {
  const questionIdFromClient = req.params.questionId;
  let results;

  try {
    results = await connectionPool.query(
      `select * from questions where id = $1`,
      [questionIdFromClient]
    );
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }

  if (!results.rows[0]) {
    return res.status(404).json({
      message: "Question not found.",
    });
  }

  return res.status(200).json({
    data: results.rows[0],
  });
});

// PUT question เพื่อแก้ไขข้อมูลของแต่ละ questionId
questionsRouter.put(
  "/:questionId",
  [validateQuestionPost],
  async (req, res) => {
    const questionIdFromClient = req.params.questionId;
    const updatedQuestion = { ...req.body };
    let results;
    try {
      results = await connectionPool.query(
        ` 
          update questions
          set title = $2, description = $3, category = $4
          where id = $1`,
        [
          questionIdFromClient,
          updatedQuestion.title,
          updatedQuestion.description,
          updatedQuestion.category,
        ]
      );
    } catch (error) {
      return res.status(500).json({
        message: "Unable to fetch questions.",
      });
    }

    if (results.rowCount === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      message: "Question updated successfully.",
    });
  }
);

// DELETE question โดยระบุ id
questionsRouter.delete("/:questionId", async (req, res) => {
  const questionIdFromClient = req.params.questionId;
  let results;

  try {
    results = await connectionPool.query(`delete from questions where id = $1`, [
      questionIdFromClient,
    ]);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete question.",
    });
  }

  if (results.rowCount === 0) {
    return res.status(404).json({
      message: "Question not found.",
    });
  }

  return res.status(200).json({
    message: "Question post has been deleted successfully.",
  });
});

export default questionsRouter;
