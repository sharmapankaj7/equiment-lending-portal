const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Equipment = require('./models/Equipment');
const BorrowRequest = require('./models/BorrowRequest');

dotenv.config();

/**
 * Seed Database with Sample Data
 * This script populates the database with test users and equipment
 */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Equipment.deleteMany({});
    await BorrowRequest.deleteMany({});
    
    console.log('Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@school.edu',
      password: 'admin123',
      role: 'admin',
      department: 'Administration'
    });

    const staff = await User.create({
      name: 'Lab Assistant',
      email: 'staff@school.edu',
      password: 'staff123',
      role: 'staff',
      department: 'Science Lab'
    });

    const student1 = await User.create({
      name: 'John Doe',
      email: 'john@school.edu',
      password: 'student123',
      role: 'student',
      studentId: 'STU001',
      department: 'Computer Science'
    });

    const student2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@school.edu',
      password: 'student123',
      role: 'student',
      studentId: 'STU002',
      department: 'Physics'
    });

    console.log('Created users');

    // Create equipment
    const equipment1 = await Equipment.create({
      name: 'Digital Camera Canon EOS',
      category: 'Cameras/Electronics',
      description: 'Professional DSLR camera for photography projects',
      condition: 'Excellent',
      quantity: 5,
      available: 5,
      addedBy: admin._id
    });

    const equipment2 = await Equipment.create({
      name: 'Basketball',
      category: 'Sports Equipment',
      description: 'Standard size basketball for outdoor use',
      condition: 'Good',
      quantity: 10,
      available: 10,
      addedBy: admin._id
    });

    const equipment3 = await Equipment.create({
      name: 'Microscope',
      category: 'Lab Equipment',
      description: 'Compound microscope for biology lab',
      condition: 'Excellent',
      quantity: 8,
      available: 8,
      addedBy: admin._id
    });

    const equipment4 = await Equipment.create({
      name: 'Acoustic Guitar',
      category: 'Musical Instruments',
      description: 'Yamaha acoustic guitar for music classes',
      condition: 'Good',
      quantity: 3,
      available: 3,
      addedBy: admin._id
    });

    const equipment5 = await Equipment.create({
      name: 'Arduino Kit',
      category: 'Project Materials',
      description: 'Arduino starter kit with sensors and components',
      condition: 'Excellent',
      quantity: 12,
      available: 12,
      addedBy: admin._id
    });

    const equipment6 = await Equipment.create({
      name: 'Tennis Racket',
      category: 'Sports Equipment',
      description: 'Professional tennis racket',
      condition: 'Good',
      quantity: 6,
      available: 6,
      addedBy: admin._id
    });

    const equipment7 = await Equipment.create({
      name: 'Projector',
      category: 'Cameras/Electronics',
      description: 'HD projector for presentations',
      condition: 'Excellent',
      quantity: 4,
      available: 4,
      addedBy: admin._id
    });

    const equipment8 = await Equipment.create({
      name: 'Beaker Set',
      category: 'Lab Equipment',
      description: 'Set of glass beakers (50ml to 500ml)',
      condition: 'Good',
      quantity: 15,
      available: 15,
      addedBy: admin._id
    });

    console.log('Created equipment');

    // Create sample borrow requests
    const request1 = await BorrowRequest.create({
      equipment: equipment1._id,
      user: student1._id,
      quantity: 1,
      purpose: 'Final year photography project',
      expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'pending'
    });

    const request2 = await BorrowRequest.create({
      equipment: equipment5._id,
      user: student2._id,
      quantity: 2,
      purpose: 'IoT project for robotics class',
      expectedReturnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: 'pending'
    });

    console.log('Created sample borrow requests');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Sample Credentials:');
    console.log('-----------------------------------');
    console.log('Admin:');
    console.log('  Email: admin@school.edu');
    console.log('  Password: admin123');
    console.log('\nStaff:');
    console.log('  Email: staff@school.edu');
    console.log('  Password: staff123');
    console.log('\nStudent 1:');
    console.log('  Email: john@school.edu');
    console.log('  Password: student123');
    console.log('\nStudent 2:');
    console.log('  Email: jane@school.edu');
    console.log('  Password: student123');
    console.log('-----------------------------------\n');

    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(seedData);
