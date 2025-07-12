const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/user.model'); // Make sure path is correct

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: 'test@gmail.com',
      password: hashedPassword
    });

    await user.save();
    console.log('✅ User created successfully!');
  } catch (err) {
    console.error('❌ Failed to create user:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

createUser();
