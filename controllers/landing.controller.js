const Blog = require('../models/blog.model');

// 🚀 Paginated Blog List
exports.getBlogListPaginated = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', category = '', from = '' } = req.body;
    const query = {
      ...(search && { title: { $regex: search, $options: 'i' } }),
      ...(category && { category }),
      ...(from && { blog_from: from }),
    };

    const docs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalDocs = await Blog.countDocuments(query);

    res.json({
      IsSuccess: true,
      Message: 'Paginated blog list fetched successfully',
      Data: {
        docs,
        totalDocs
      }
    });
  } catch (err) {
    next(err);
  }
};

// 📄 Blog List Without Pagination
exports.getBlogListAll = async (req, res, next) => {
  try {
    const { search = '', category = '', from = '' } = req.body;
    const query = {
      ...(search && { title: { $regex: search, $options: 'i' } }),
      ...(category && { category }),
      ...(from && { blog_from: from }),
    };

    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    res.json({
      IsSuccess: true,
      Message: 'Full blog list fetched successfully',
      Data: blogs
    });
  } catch (err) {
    next(err);
  }
};

// 🔍 Get Blog by ID
exports.getBlogById = async (req, res, next) => {
  try {
    const { url_slug } = req.body;

    if (!url_slug || typeof url_slug !== 'string') {
      return res.status(400).json({
        IsSuccess: false,
        Message: 'url_slug is required',
        Data: null
      });
    }

    const blog = await Blog.findOne({ url_slug });

    if (!blog) {
      return res.status(404).json({
        IsSuccess: false,
        Message: 'Blog not found',
        Data: null
      });
    }

    return res.status(200).json({
      IsSuccess: true,
      Message: 'Blog fetched successfully',
      Data: blog
    });

  } catch (err) {
    next(err);
  }
};

// 🌐 Get All Routes (Slugs)
exports.getAllRoutes = async (req, res, next) => {
  try {
    const routes = await Blog.find({}, { _id: 0, url_slug: 1 });
    const slugs = routes.map(r => r.url_slug);

    res.json({
      IsSuccess: true,
      Message: 'All routes fetched successfully',
      Data: slugs
    });
  } catch (err) {
    next(err);
  }
};
