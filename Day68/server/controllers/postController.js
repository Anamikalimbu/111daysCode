const Post = require("../models/Post");

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.create({ title, content, author: req.user._id });
  res.status(201).json(post);
};

const getAllPosts = async (req, res) => {
  const posts = await Post.find().populate("author", "name email");
  res.json(posts);
};

const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name email");
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
};

const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized to update this post" });
  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  const updated = await post.save();
  res.json(updated);
};

const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized to delete this post" });
  await post.deleteOne();
  res.json({ message: "Post deleted successfully" });
};

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost };
