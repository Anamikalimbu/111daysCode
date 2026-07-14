const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    category: { type: String, trim: true, default: 'general' },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

todoSchema.index({ user: 1, completed: 1 });
todoSchema.index({ user: 1, dueDate: 1 });

module.exports = mongoose.model('Todo', todoSchema);
