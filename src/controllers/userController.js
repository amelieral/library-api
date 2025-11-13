import User from "../models/User.js";
import Book from "../models/Book.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("borrowedBooks");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("borrowedBooks");
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, username } = req.body;

    if (!firstName || !lastName || !username) {
      return res.status(400).json({ message: "Не указаны firstName, lastName или username" });
    }

    if (firstName.length < 2 || lastName.length < 2) {
      return res
        .status(400)
        .json({ message: "Имя и фамилия должны быть не менее 2 символов" });
    }

    if (username.length < 5) {
      return res
        .status(400)
        .json({ message: "Username должен быть не менее 5 символов" });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      username,
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, username } = req.body;
    const { id } = req.params;

    if (!firstName || !lastName || !username) {
      return res.status(400).json({ message: "Не указаны firstName, lastName или username" });
    }

    if (firstName.length < 2 || lastName.length < 2) {
      return res
        .status(400)
        .json({ message: "Имя и фамилия должны быть не менее 2 символов" });
    }

    if (username.length < 5) {
      return res
        .status(400)
        .json({ message: "Username должен быть не менее 5 символов" });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, username },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Пользователь не найден" });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Пользователь не найден" });
    res.status(200).json({ message: "Пользователь удалён" });
  } catch (err) {
    next(err);
  }
};

export const borrowBook = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { bookId } = req.body;

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book)
      return res.status(404).json({ message: "Пользователь или книга не найдены" });

    if (!book.isAvailable)
      return res.status(400).json({ message: "Книга уже занята" });

    book.isAvailable = false;
    await book.save();

    user.borrowedBooks.push(bookId);
    await user.save();

    res.status(200).json({ message: "Книга взята", user });
  } catch (err) {
    next(err);
  }
};

export const returnBook = async (req, res, next) => {
  try {
    const { userId, bookId } = req.params;

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book)
      return res.status(404).json({ message: "Пользователь или книга не найдены" });

    user.borrowedBooks = user.borrowedBooks.filter(b => b.toString() !== bookId);
    await user.save();

    book.isAvailable = true;
    await book.save();

    res.status(200).json({ message: "Книга возвращена", user });
  } catch (err) {
    next(err);
  }
};
