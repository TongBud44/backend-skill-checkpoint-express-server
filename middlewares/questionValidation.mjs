export function validateQuestionPost(req, res, next) {
  const { title, description, category } = req.body;

  // ตรวจสอบว่ามีการป้อนข้อมูลในแต่ละ field มาหรือไม่
  if (!title || !description || !category) {
    return res.status(400).json({
      message: "Invalid request data.",
    });
  }

  // ตรวจสอบ type ของข้อมูลที่ Client ส่งมา
  if (typeof title !== "string") {
    return res.status(400).json({ message: "Title must be a string type" });
  }

  if (typeof description !== "string") {
    return res
      .status(400)
      .json({ message: "Description must be a string type" });
  }

  if (typeof category !== "string") {
    return res.status(400).json({ message: "Category must be a string type" });
  }

  next(); // สั่งว่า เมื่อ middleware ทำงานสำเร็จ ให้ไปทำ Controller function ต่อได้เลย
}
