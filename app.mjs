import express from "express";
import questionsRouter from "./routes/questionsRouter.mjs";
import answersRouter from "./routes/answersRouter.mjs";

const app = express();
const port = 4000;

app.use(express.json());
app.use("/questions", questionsRouter);
app.use("/questions", answersRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
