const Blog = require('../models/blog.model');
const moment = require('moment');

// 🚀 Get paginated blog list
exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, category = '', search = '' } = req.body;
    const query = {
      blog_from: 'blogsmk',
      ...(category && { category }),
      ...(search && { title: new RegExp(search, 'i') })
    };

    const docs = await Blog.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalDocs = await Blog.countDocuments(query);

    return res.json({
      IsSuccess: true,
      Message: 'Blog list fetched successfully',
      Data: {
        docs,
        totalDocs
      }
    });
  } catch (err) {
    next(err);
  }
};

// 🧾 Get single blog by ID
exports.getOne = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.body.blogid);
    if (!blog) {
      return res.status(404).json({
        IsSuccess: false,
        Message: 'Blog not found',
        Data: null
      });
    }
    return res.json({
      IsSuccess: true,
      Message: 'Blog fetched successfully',
      Data: blog
    });
  } catch (err) {
    next(err);
  }
};

exports.save = async (req, res, next) => {
  try {
    const data = req.body;

    // Required field validation
    const requiredFields = [
      'banner_image', 'banner_alttext', 'category', 'title', 'blog_date',
      'brief', 'meta_title', 'url_slug', 'canonical',
      'og_title', 'og_description', 'og_url', 'og_type',
      'og_sitename', 'meta_description'
    ];

    const missingFields = requiredFields.filter(field => {
      const val = data[field];
      return val === undefined || val === null || val.toString().trim() === '';
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        IsSuccess: false,
        Message: `Validation Failed: Missing fields - ${missingFields.join(', ')}`,
        errors: missingFields,
        Data: null
      });
    }

    // URL slug validation
    const slugPattern = /^[a-zA-Z0-9-_]+$/;
    if (!slugPattern.test(data.url_slug)) {
      return res.status(400).json({
        IsSuccess: false,
        Message: 'Invalid URL Slug format. Only letters, numbers, hyphens, and underscores are allowed.',
        Data: null
      });
    }

    // Validate other_image array
    if (data.other_image && !Array.isArray(data.other_image)) {
      return res.status(400).json({
        IsSuccess: false,
        Message: 'other_image must be an array',
        Data: null
      });
    }

    if (Array.isArray(data.other_image) && data.other_image.length > 0) {
      const invalidOtherImages = data.other_image.filter(
        img => !img.path || !img.description || !img.alttext
      );

      if (invalidOtherImages.length > 0) {
        return res.status(400).json({
          IsSuccess: false,
          Message: 'Each item in other_image must include path, description, and alttext',
          Data: null
        });
      }
    }

    // ✅ Properly parse blog_date as UTC date (no time shift)
    const dateParts = data.blog_date.split('-');
    if (dateParts.length !== 3) {
      return res.status(400).json({
        IsSuccess: false,
        Message: 'Invalid blog_date format. Use DD-MM-YYYY',
        Data: null
      });
    }

    const [day, month, year] = dateParts.map(Number);
    if (!day || !month || !year) {
      return res.status(400).json({
        IsSuccess: false,
        Message: 'Invalid blog_date values. Provide a full DD-MM-YYYY date.',
        Data: null
      });
    }

    const blogDate = new Date(Date.UTC(year, month - 1, day)); // UTC date without time shift

    // Construct blog payload
    const blogPayload = {
      banner_image: data.banner_image,
      banner_alttext: data.banner_alttext,
      category: data.category,
      title: data.title,
      blog_date: blogDate,
      brief: data.brief,
      meta_title: data.meta_title,
      url_slug: data.url_slug,
      canonical: data.canonical,
      og_title: data.og_title,
      og_description: data.og_description,
      og_url: data.og_url,
      og_type: data.og_type,
      og_sitename: data.og_sitename,
      meta_description: data.meta_description,
      blog_from: data.blog_from || 'blogsmk',
      other_image: data.other_image || []
    };

    // ✅ Create or update logic
    let result;
    if (data.blogid) {
      result = await Blog.findByIdAndUpdate(data.blogid, blogPayload, { new: true });
      if (!result) {
        return res.status(404).json({
          IsSuccess: false,
          Message: 'Blog not found for update',
          Data: null
        });
      }
    } else {
      const newBlog = new Blog(blogPayload);
      result = await newBlog.save();
    }

    return res.status(data.blogid ? 200 : 201).json({
      IsSuccess: true,
      Message: data.blogid ? 'Blog updated successfully' : 'Blog created successfully',
      Data: result
    });

  } catch (err) {
    console.error('Error saving blog:', err);
    return res.status(500).json({
      IsSuccess: false,
      Message: 'An unexpected error occurred while saving the blog.',
      Data: null
    });
  }
};
// ❌ Delete blog
exports.remove = async (req, res, next) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.body.blogid);
    if (!deleted) {
      return res.status(404).json({
        IsSuccess: false,
        Message: 'Blog not found',
        Data: null
      });
    }

    return res.json({
      IsSuccess: true,
      Message: 'Blog removed successfully',
      Data: null
    });
  } catch (err) {
    next(err);
  }
};

// 📤 Upload banner image
exports.upload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      IsSuccess: false,
      Message: 'File not uploaded',
      Data: null
    });
  }

  return res.json({
    IsSuccess: true,
    Message: 'File uploaded successfully',
    Data: {
      imagePath: `/uploads/${req.file.filename}`
    }
  });
};
