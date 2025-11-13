import Book from "../models/Book.js";

export const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Книга не найдена" });
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

export const createBook = async (req, res, next) => {
  try {
    const { title, author, year } = req.body;

    if (!title || title.length < 2)
      return res.status(400).json({ message: "Название книги должно быть не менее 2 символов" });
    if (!author || author.length < 2)
      return res.status(400).json({ message: "Автор должен быть не менее 2 символов" });

    const newBook = await Book.create({
      title,
      author,
      year: year || new Date().getFullYear(),
      isAvailable: true
    });

    res.status(201).json(newBook);
  } catch (err) {
    next(err);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const { title, author, year } = req.body;
    const { id } = req.params;

    if (!title || title.length < 2)
      return res.status(400).json({ message: "Название книги должно быть не менее 2 символов" });
    if (!author || author.length < 2)
      return res.status(400).json({ message: "Автор должен быть не менее 2 символов" });

    const updated = await Book.findByIdAndUpdate(
      id,
      { title, author, year },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Книга не найдена" });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Книга не найдена" });
    res.status(200).json({ message: "Книга удалена" });
  } catch (err) {
    next(err);
  }
};

