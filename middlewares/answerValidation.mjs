export function validateAnswerPost(req, res, next) {
  const { content } = req.body;

  // ตรวจสอบความยาวข้อมูลไม่เกิน 300 ตัวอักษร
  if (!content || content.length > 300) {
    return res.status(400).json({
      message: "Invalid request data.",
    });
  }

  next(); // สั่งว่า เมื่อ middleware ทำงานสำเร็จ ให้ไปทำ Controller function ต่อได้เลย
}
