const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const landingRoutes = require('./routes/landing.routes');
const blogRoutes = require('./routes/blog.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const PORT = process.env.PORT || 1000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/admin', authRoutes);
app.use('/admin/blogs', blogRoutes);
app.use('/landing', landingRoutes);

app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(err => console.log(err));
