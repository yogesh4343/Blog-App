const { default: mongoose } = require("mongoose");
const Blog = require("../models/Blog");
const User = require("../models/User");

const getAllBlogs = async (req, res, next) => {
  let blogs;

  // ======================================================================================== start
  try {
    blogs = await Blog.find().populate('user');

    // ======================================================================================== 
  } catch (error) {
    return console.log(error);
  }

  if (!blogs) {
    return res.status(404).json({ message: "No blogs " });
  }
  return res.status(200).json({ blogs });
};

// ad blog
const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;

  // ======================================================================================== start
  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (error) {
    return console.log(error);
  }
  // ========================================================================================

  if (!existingUser) {
    return res
      .status(400)
      .json({ message: "Unable to find the user by user id " });
  }

  const blog = new Blog({
    title,
    description,
    image,
    user,
  });

  // ========================================================================================  start

  try {
    //    await blog.save()
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }

  // ========================================================================================

  return res.status(200).json({ blog });
};

// update blog

const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
    });
  } catch (error) {
    return console.log(error);
  }

  if (!blog) {
    return res.status(500).json({ message: "Unable to update the blog" });
  }
  return res.status(200).json({ blog });
};

// get single
const getById = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (error) {
    return console.log(error);
  }

  if (!blog) {
    return res.status(404).json({ message: "No blog found" });
  }
  return res.status(200).json({ blog });
};

// delete

const deleteBlog = async (req, res, next) => {
  const id = req.params.id;

  let blog;
  try {
    // ========================================================================================  start

    // blog = await Blog.findByIdAndRemove(id)
    blog = await Blog.findByIdAndRemove(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();

    // ========================================================================================
  } catch (error) {
    return console.log(error);
  }

  if (!blog) {
    return res.status(500).json({ message: "Unable To delete" });
  }
  return res.status(200).json({ message: "Successfullt Deletee" });
};

// getByUserId

// ========================================================================================  start

const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (error) {
    return console.log(error);
  }

  if (!userBlogs) {
    return res.status(404).json({ message: "No blogs found" });
  }
  return res.status(200).json({ user: userBlogs });
};
// ========================================================================================

module.exports = {
  getAllBlogs,
  addBlog,
  updateBlog,
  getById,
  deleteBlog,
  getByUserId,
};
