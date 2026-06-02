let notes = [
  {
    id: 1,
    title: "Learn Express",
    description: "Practice CRUD"
  }
];

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.get("/notes/:id", (req, res) => {
  const note = notes.find(
    n => n.id === Number(req.params.id)
  );

  if (!note) {
    return res.status(404).json({
      message: "Note not found"
    });
  }

  res.json(note);
});

app.post("/notes", (req, res) => {
  const note = {
    id: notes.length + 1,
    title: req.body.title,
    description: req.body.description
  };

  notes.push(note);

  res.status(201).json(note);
});

app.put("/notes/:id", (req, res) => {
  const note = notes.find(
    n => n.id === Number(req.params.id)
  );

  if (!note) {
    return res.status(404).json({
      message: "Note not found"
    });
  }

  note.title = req.body.title;
  note.description = req.body.description;

  res.json(note);
});

app.delete("/notes/:id", (req, res) => {

  const index = notes.findIndex(
    n => n.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Note not found"
    });
  }

  notes.splice(index, 1);

  res.json({
    message: "Note deleted"
  });
});