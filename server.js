const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
let books = [
  { id: 1, title: "Vignan", author: "Krishna" },
  { id: 2, title: "To Kill a Mocking Bird", author: "Lee" },
  { id: 3, title: "CSE", author: "Xy" },
  { id: 4, title: "Abc", author: "Wx" }
];
let users = [
  { id: 1, name: "Sri", borrowed: [1, 3] },
  { id: 2, name: "X", borrowed: [] }
];
let history = [];
app.get("/", (req, res) => {
  res.json({ message: " Library API is running!" });
});
app.get("/books", (req, res) => res.json(books));
app.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});
app.post("/books", (req, res) => {
  const { id, title, author } = req.body;
  if (!id || !title) return res.status(400).json({ error: "id and title required" });
  if (books.some(b => b.id === id)) return res.status(409).json({ error: "Book ID already exists" });
  const newBook = { id, title, author: author || "Unknown", available: true };
  books.push(newBook);
  res.status(201).json(newBook);
});
app.get("/users", (req, res) => res.json(users));
app.post("/users", (req, res) => {
  const { id, name, subscription } = req.body;
  if (!id || !name) return res.status(400).json({ error: "id and name required" });
  if (users.some(u => u.id === id)) return res.status(409).json({ error: "User ID already exists" });
  const newUser = { id, name, subscription: subscription || "free", borrowed: [] };
  users.push(newUser);
  res.status(201).json(newUser);
});
app.put("/users/:id/subscription", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!req.body.subscription) return res.status(400).json({ error: "subscription required" });
  user.subscription = req.body.subscription;
  res.json(user);
});
app.post("/borrow", (req, res) => {
  const { userId, bookId } = req.body;
  const user = users.find(u => u.id === userId);
  const book = books.find(b => b.id === bookId);
  if (!user || !book) return res.status(404).json({ error: "User or Book not found" });
  if (!book.available) return res.status(400).json({ error: "Book already borrowed" });
  book.available = false;
  user.borrowed.push(bookId);
  history.push({ userId, bookId, action: "borrow", date: new Date() });
  res.json({ message: "Book borrowed successfully", user, book });
});
app.post("/return", (req, res) => {
  const { userId, bookId } = req.body;
  const user = users.find(u => u.id === userId);
  const book = books.find(b => b.id === bookId);
  if (!user || !book) return res.status(404).json({ error: "User or Book not found" });
  const idx = user.borrowed.indexOf(bookId);
  if (idx === -1) return res.status(400).json({ error: "User didn't borrow this book" });
  user.borrowed.splice(idx, 1);
  book.available = true;
  history.push({ userId, bookId, action: "return", date: new Date() });
  res.json({ message: "Book returned successfully", user, book });
});
app.get("/users/:id/history", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const userHistory = history.filter(h => h.userId === user.id);
  res.json({ user: { id: user.id, name: user.name }, history: userHistory });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Library API running on port ${PORT}`));
