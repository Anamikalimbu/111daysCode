require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

const users = [
  { name: 'Anamika Limbu', email: 'anamikalimbu8@gmail.com', password: 'password123', role: 'admin' },
  { name: 'Smriti Rai', email: 'smriti@gmail.com', password: 'password123' },
  { name: 'Ragita', email: 'ragita@gmail.com', password: 'password123' }
];

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    const created = await User.create(users);
    console.log(`✔ Inserted ${created.length} users`);
    created.forEach(u => console.log(`- ${u.email} (${u.role})`));
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
