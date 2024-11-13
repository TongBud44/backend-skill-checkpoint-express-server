import express from "express";
import questionsRouter from "./routes/questionsRouter.mjs";

const app = express();
const port = 4000;

app.use(express.json());
app.use("/questions", questionsRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
