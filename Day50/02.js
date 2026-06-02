const express = require("express");

const app = express();

app.use(express.json());

let students = [
  {
    id: 1,
    name: "Ram"
  }
];


// GET all students
app.get("/students", (req, res) => {
  res.status(200).json(students);
});


// GET student by id
app.get("/students/:id", (req, res) => {
  const student = students.find(
    s => s.id === Number(req.params.id)
  );

  if (!student) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  res.status(200).json(student);
});


// POST student
app.post("/students", (req, res) => {
  const newStudent = {
    id: students.length + 1,
    name: req.body.name
  };

  students.push(newStudent);

  res.status(201).json(newStudent);
});


// PUT student
app.put("/students/:id", (req, res) => {

  const student = students.find(
    s => s.id === Number(req.params.id)
  );

  if (!student) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  student.name = req.body.name;

  res.status(200).json(student);
});


// DELETE student
app.delete("/students/:id", (req, res) => {

  const index = students.findIndex(
    s => s.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  students.splice(index, 1);

  res.status(200).json({
    message: "Student deleted"
  });
});

app.listen(3000);