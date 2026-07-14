const express = require('express');
const {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  getStats,
} = require('../controllers/todoController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // every route below requires a valid JWT

router.get('/stats/summary', getStats);
router.route('/').get(getTodos).post(createTodo);
router.route('/:id').get(getTodo).put(updateTodo).delete(deleteTodo);
router.patch('/:id/toggle', toggleTodo);

module.exports = router;
