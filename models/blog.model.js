const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    banner_image: String,
    banner_alttext: String,
    category: String,
    title: String,
    blog_date: Date,
    brief: String,
    meta_title: String,
    url_slug: String,
    canonical: String,
    og_title: String,
    og_description: String,
    og_url: String,
    og_type: String,
    og_sitename: String,
    meta_description: String,
    blog_from: String,
    other_image: [
      {
        path: String,
        description: String,
        alttext: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
