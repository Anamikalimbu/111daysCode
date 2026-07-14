const Todo = require('../models/Todo');

// @route GET /api/todos
// Supports query params: status(all|active|completed), priority, category, sort, search
const getTodos = async (req, res, next) => {
  try {
    const { status, priority, category, search, sort } = req.query;
    const filter = { user: req.user._id };

    if (status === 'active') filter.completed = false;
    if (status === 'completed') filter.completed = true;
    if (priority && priority !== 'all') filter.priority = priority;
    if (category && category !== 'all') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    let sortOption = { createdAt: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    if (sort === 'priority') sortOption = { priority: 1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const todos = await Todo.find(filter).sort(sortOption);
    res.json({ count: todos.length, todos });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/todos/:id
const getTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ todo });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/todos
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = await Todo.create({
      user: req.user._id,
      title: title.trim(),
      description,
      priority,
      category,
      dueDate: dueDate || null,
    });

    res.status(201).json({ todo });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/todos/:id
const updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    const fields = ['title', 'description', 'completed', 'priority', 'category', 'dueDate'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) todo[field] = req.body[field];
    });

    await todo.save();
    res.json({ todo });
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/todos/:id/toggle
const toggleTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.completed = !todo.completed;
    await todo.save();
    res.json({ todo });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/todos/:id
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/todos/stats/summary
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [total, completed, active, highPriority] = await Promise.all([
      Todo.countDocuments({ user: userId }),
      Todo.countDocuments({ user: userId, completed: true }),
      Todo.countDocuments({ user: userId, completed: false }),
      Todo.countDocuments({ user: userId, completed: false, priority: 'high' }),
    ]);
    res.json({ total, completed, active, highPriority });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  getStats,
};
