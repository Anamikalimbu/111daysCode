let books = [
  {
    id: 1,
    title: "Node.js",
    author: "John"
  }
];

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const book = books.find(
    b => b.id === Number(req.params.id)
  );

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  res.json(book);
});

app.post("/books", (req, res) => {
  const book = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author
  };

  books.push(book);

  res.status(201).json(book);
});

app.put("/books/:id", (req, res) => {
  const book = books.find(
    b => b.id === Number(req.params.id)
  );

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  book.title = req.body.title;
  book.author = req.body.author;

  res.json(book);
});

app.delete("/books/:id", (req, res) => {

  const index = books.findIndex(
    b => b.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  books.splice(index, 1);

  res.json({
    message: "Book deleted"
  });
});