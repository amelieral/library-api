export default function errorHandler(err, req, res, next) {
  console.error("Ошибка:", err);
  res.status(500).json({ message: "Внутренняя ошибка сервера" });
}