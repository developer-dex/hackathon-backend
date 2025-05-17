import mongoose from 'mongoose';
import { KudosCategoryModel } from '../infrastructure/database/models/KudosCategoryModel';
import { TeamModel } from '../infrastructure/database/models/TeamModel';
import { KudosModel } from '../infrastructure/database/models/KudosModel';
import dotenv from 'dotenv';
import { UserModel } from '../infrastructure/database/models/UserModel';
import bcrypt from 'bcryptjs';
// Load environment variables
dotenv.config();

// Function to insert sample team data
const insertTeamData = async (): Promise<void> => {
  try {
    // Check if teams already exist
    const teamCount = await TeamModel.countDocuments();
    if (teamCount > 0) {
      console.log(`Teams already exist in the database (${teamCount} found). Skipping team insertion.`);
      return;
    }

    const teams = [
      { name: 'Engineering', _id: '60286739c762b78cce0edfe4' },
      { name: 'Product Management', _id: '60286743c762b78cce0edfea' },
      { name: 'Design', _id: '60286747c762b78cce0edfed' },
      { name: 'Marketing', _id: '6028674bc762b78cce0edff0' },
      { name: 'Sales', _id: '6028674fc762b78cce0edff3' },
      { name: 'Customer Support', _id: '60286753c762b78cce0edff6' },
      { name: 'Human Resources', _id: '60286757c762b78cce0edff9' },
      { name: 'Finance', _id: '6028675bc762b78cce0edffc' },
      { name: 'Operations', _id: '6028675fc762b78cce0edfff' },
      { name: 'Research & Development', _id: '60286763c762b78cce0ee002' }
    ];

    await TeamModel.insertMany(teams);
    console.log(`Successfully inserted ${teams.length} teams`);
  } catch (error) {
    console.error('Error inserting team data:', error);
  }
};

// Function to insert sample user data
const insertUserData = async (): Promise<void> => {
  try {
    // Check if users already exist
    const userCount = await UserModel.countDocuments();
    if (userCount > 0) {
      console.log(`Users already exist in the database (${userCount} found). Skipping user insertion.`);
      return;
    }

    const salt = await bcrypt.genSalt(10);

    const users = [
      {
        _id: '68288abbdb9addbe5a490101',
        name: 'Dhruvin Khant',
        email: 'admin.doe@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '60286739c762b78cce0edfe4',
        role: 'Admin',
        verificationStatus: 'Verified'  
      },
      {
        _id: '68288a25db9addbe5a4900fb',
        name: 'Gaurav Soni',
        email: 'gaurav@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '60286743c762b78cce0edfea',
        role: 'Team Lead',
        verificationStatus: 'Verified'
      },
      {
        _id: '68288a80db9addbe5a490102',
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '60286747c762b78cce0edfed',
        role: 'Team Lead',
        verificationStatus: 'Verified'
      },
      {
        _id: '68288a80db9addbe5a490103',
        name: 'Bob Brown',
        email: 'bob.brown@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '60286753c762b78cce0edff6',
        role: 'Team Lead',
        verificationStatus: 'Verified'
      },
      {
        _id: '68288a80db9addbe5a490104',
        name: 'Akshat Kansara',
        email: 'akshat@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '60286757c762b78cce0edff9',
        role: 'Team Member',
        verificationStatus: 'Verified'
      },
      {
        _id: '68288a80db9addbe5a490105',
        name: 'Dev Shah',
        email: 'dev@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '6028675bc762b78cce0edffc',
        role: 'Team Member',
        verificationStatus: 'Verified'
      },
      {
        _id: '68288a80db9addbe5a490106',
        name: 'Dharmik Gohel',
        email: 'dharmik@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '60286763c762b78cce0ee002',
        role: 'Team Member',
        verificationStatus: 'Verified'
      },
      {
        _id: '68288a80db9addbe5a490107',
        name: 'Fiona Black',
        email: 'fiona.black@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '60286739c762b78cce0edfe4', 
        role: 'Team Member',
        verificationStatus: 'Verified'
      },
      {
        _id: '68288a80db9addbe5a490108',
        name: 'George Blue',
        email: 'george.blue@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '60286743c762b78cce0edfea',
        role: 'Team Member',
        verificationStatus: 'Verified'
      },
      { 
        _id: '68288a80db9addbe5a490109',
        name: 'Harry Red',
        email: 'harry.red@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '60286747c762b78cce0edfed',
        role: 'Team Member',
        verificationStatus: 'Verified'
      },
      {
        _id: '68288a80db9addbe5a49010a',
        name: 'Ivy Yellow',
        email: 'ivy.yellow@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '6028674bc762b78cce0edff0',
        role: 'Team Member',       
        verificationStatus: 'Verified'
      },
      {
        _id: '68288a80db9addbe5a49010b',
        name: 'Jack Purple',
        email: 'jack.purple@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '6028674fc762b78cce0edff3',
        role: 'Team Member',
        verificationStatus: 'Verified'
      },
      {
        _id: '68288a80db9addbe5a49010c',
        name: 'Kyle Orange',        
        email: 'kyle.orange@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '60286753c762b78cce0edff6',
        role: 'Team Member',
        verificationStatus: 'Verified'
      },
      {
        _id: '68288a80db9addbe5a49010d',
        name: 'Lily Green',
        email: 'lily.green@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '60286757c762b78cce0edff9',
        role: 'Team Member',
        verificationStatus: 'Verified'
      },
      {
        _id: '68288a80db9addbe5a49010e',
        name: 'Mia Blue',
        email: 'mia.blue@example.com',
        password: await bcrypt.hash('Test@123', salt),
        teamId: '6028675bc762b78cce0edffc',
        role: 'Team Member',
        verificationStatus: 'Verified'
      }
    ];

    await UserModel.insertMany(users);
    console.log(`Successfully inserted ${users.length} users`);
  } catch (error) {
    console.error('Error inserting user data:', error);
  }
};

// Function to insert sample category data
const insertCategoryData = async (): Promise<void> => {
  try {
    // Check if categories already exist
    const categoryCount = await KudosCategoryModel.countDocuments();
    if (categoryCount > 0) {
      console.log(`Categories already exist in the database (${categoryCount} found). Skipping category insertion.`);
      return;
    }

    const categories = [
        {
          name: 'TEAMWORK',
          description: 'Recognition for excellent collaboration and team spirit',
          icon: 'https://img.icons8.com/ios-filled/50/3498db/user-group-man-man.png',
          color: '#7fb8e8',
          _id: '68286767c762b78cce0ee005'
        },
        {
          name: 'INNOVATION',
          description: 'Recognition for creative solutions and innovative thinking',
          icon: 'https://img.icons8.com/ios-filled/50/9b59b6/idea.png',
          color: '#c29ed1',
          _id: '6828676bc762b78cce0ee008'
        },
        {
          name: 'EXCELLENCE',
          description: 'Recognition for outstanding performance and quality work',
          icon: 'https://img.icons8.com/ios-filled/50/f1c40f/star.png',
          color: '#f6da75',
          _id: '6828676fc762b78cce0ee00b'
        },
        {
          name: 'LEADERSHIP',
          description: 'Recognition for guiding others and leading by example',
          icon: 'https://img.icons8.com/ios-filled/50/e74c3c/trophy.png',
          color: '#ef8b81',
          _id: '68286773c762b78cce0ee00e'
        },
        {
          name: 'HELPFULNESS',
          description: 'Recognition for providing support and assistance to others',
          icon: 'https://img.icons8.com/ios-filled/50/2ecc71/helping-hand.png',
          color: '#7fdeaa',
          _id: '68286777c762b78cce0ee011'
        },
        {
          name: 'PROBLEM_SOLVING',
          description: 'Recognition for effectively solving complex problems',
          icon: 'https://img.icons8.com/ios-filled/50/e67e22/puzzle.png',
          color: '#efaa7a',
          _id: '6828677bc762b78cce0ee014'
        },
        {
          name: 'MENTORSHIP',
          description: 'Recognition for guiding and developing others',
          icon: 'https://img.icons8.com/ios-filled/50/1abc9c/training.png',
          color: '#7dd4c2',
          _id: '6828677fc762b78cce0ee017'
        },
        {
          name: 'DEDICATION',
          description: 'Recognition for commitment and going above and beyond',
          icon: 'https://img.icons8.com/ios-filled/50/d35400/fire-element.png',
          color: '#e89464',
          _id: '68286783c762b78cce0ee01a'
        },
        {
          name: 'COMMUNICATION',
          description: 'Recognition for clear and effective communication',
          icon: 'https://img.icons8.com/ios-filled/50/27ae60/comments.png',
          color: '#76cc9b',
          _id: '68286787c762b78cce0ee01d'
        },
        {
          name: 'INITIATIVE',
          description: 'Recognition for taking initiative and proactive approach',
          icon: 'https://img.icons8.com/ios-filled/50/8e44ad/flag.png',
          color: '#b579d2',
          _id: '6828678bc762b78cce0ee020'
        }
      ];

    await KudosCategoryModel.insertMany(categories);
    console.log(`Successfully inserted ${categories.length} categories`);
  } catch (error) {
    console.error('Error inserting category data:', error);
  }
};

// Function to insert sample kudos data
const insertKudosData = async (): Promise<void> => {
  try {
    // Check if kudos already exist
    const kudosCount = await KudosModel.countDocuments();
    if (kudosCount > 0) {
      console.log(`Kudos already exist in the database (${kudosCount} found). Skipping kudos insertion.`);
      return;
    }

    // Get category IDs for referencing
    const categoryIds = [
        "68286767c762b78cce0ee005",
        "6828676bc762b78cce0ee008",
        "6828676fc762b78cce0ee00b",
        "68286773c762b78cce0ee00e",
        "68286777c762b78cce0ee011",
        "6828677bc762b78cce0ee014",
        "6828677fc762b78cce0ee017",
        "68286783c762b78cce0ee01a",
        "68286787c762b78cce0ee01d",
        "6828678bc762b78cce0ee020"
      ];

    // User IDs provided
    const receiverIds = [
        "68288a80db9addbe5a490104",
        "68288a80db9addbe5a490105",
        "68288a80db9addbe5a490106",
        "68288a80db9addbe5a490107",
        "68288a80db9addbe5a490108",
        "68288a80db9addbe5a490109",
        "68288a80db9addbe5a49010a",
        "68288a80db9addbe5a49010b",
        "68288a80db9addbe5a49010c",
        "68288a80db9addbe5a49010d",
        "68288a80db9addbe5a49010e"
      ];
    const senderIds = [
        "68288a25db9addbe5a4900fb",
        "68288a80db9addbe5a490102",
        "68288a80db9addbe5a490103"
      ];
    
    // Team IDs provided
    const teamIds = [
        "60286739c762b78cce0edfe4",
        "60286743c762b78cce0edfea",
        "60286747c762b78cce0edfed",
        "6028674bc762b78cce0edff0",
        "6028674fc762b78cce0edff3",
        "60286753c762b78cce0edff6",
        "60286757c762b78cce0edff9",
        "6028675bc762b78cce0edffc",
        "6028675fc762b78cce0edfff",
        "60286763c762b78cce0ee002"
      ];

    // Sample messages for kudos
    const messages = [
      "Thank you for your incredible support on the project! Your commitment to excellence truly stands out.",
      "I really appreciate how you stepped up during our team crisis. Your leadership made all the difference!",
      "Your innovative solution saved us countless hours of work. Thank you for thinking outside the box!",
      "The way you mentored our new team members shows your dedication to our team's growth. Thank you!",
      "Your positive attitude during challenging times keeps our team motivated. We're lucky to have you!",
      "I'm impressed by how you handled that difficult client situation with such professionalism and grace.",
      "Thank you for always being willing to lend a hand, even when you have your own deadlines.",
      "Your attention to detail on the last release prevented several critical bugs. Great job!",
      "The presentation you delivered to the executives was simply outstanding. You represented our team brilliantly!",
      "Your consistent delivery of high-quality work sets a standard for all of us to follow.",
      "Your proactive approach to problem-solving is commendable. You're a true asset to our team!",
      "Your ability to mentor and guide others is invaluable. Thank you for sharing your knowledge.",
      "Your commitment to our team's success is evident in everything you do. Keep up the great work!",
      "Your positive attitude and willingness to help others make you a true team player.",
      "Your creative thinking and innovative solutions are always a joy to see. Keep it up!",
      "Your dedication to our team's goals is inspiring. We couldn't have done it without you!",
      "Your clear communication skills are a gift to our team. Thank you for sharing your thoughts.",
      "Your initiative in taking on new challenges is commendable. You're a true leader!",
      "Your ability to stay calm under pressure is a valuable trait. We're lucky to have you!",
      "Your attention to detail is unmatched. It's a pleasure to work with you.",
      "Your ability to think outside the box is a true asset to our team. Keep it up!",
      
      
    ];

    // Create an array of kudos objects
    const kudosData = [];
    
    for (let i = 0; i < 21; i++) {
      // Alternate between receivers
      const receiverId = receiverIds[i % receiverIds.length];
      // Cycle through team IDs
      const teamId = teamIds[i % teamIds.length];
      // Cycle through categories
      const categoryId = categoryIds[i % categoryIds.length];

      const senderId = senderIds[i % senderIds.length];
      
      kudosData.push({
        senderId: senderId,
        receiverId: receiverId,
        categoryId: categoryId,
        teamId: teamId,
        message: messages[i]
      });
    }

    await KudosModel.insertMany(kudosData);
    console.log(`Successfully inserted ${kudosData.length} kudos`);
  } catch (error) {
    console.error('Error inserting kudos data:', error);
  }
};

// Main function to run all data insertion processes
export const runDataInsertProcess = async (): Promise<void> => {
  try {
    // Check if MongoDB is already connected
    const shouldDisconnect = mongoose.connection.readyState !== 1;
    
    // Connect to MongoDB if not already connected
    if (shouldDisconnect) {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('MONGODB_URI environment variable is not defined');
      }
      await mongoose.connect(uri);
      console.log('Connected to MongoDB from data insert process');
    }

    // Run data insertion functions
    await insertTeamData();
    await insertCategoryData();
    await insertKudosData();
    await insertUserData();
    console.log('Data insertion process completed successfully');
    
    // Disconnect only if we connected in this function
    if (shouldDisconnect) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('Error running data insertion process:', error);
  }
};

// Drop all the collections
const dropCollections = async (): Promise<void> => {
  try {
    // Check if MongoDB is already connected
    if (mongoose.connection.readyState !== 1) {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('MONGODB_URI environment variable is not defined');
      }
      await mongoose.connect(uri);
      console.log('Connected to MongoDB for dropping collections');
    }
    
    // Drop individual collections instead of the entire database
    const collectionsToDelete = [
      'kudoscategories',
      'teams',
      'kudos',
      'users'
    ];
    
    for (const collection of collectionsToDelete) {
      try {
        if ((await mongoose.connection.db.listCollections({ name: collection }).toArray()).length > 0) {
          await mongoose.connection.db.collection(collection).drop();
          console.log(`Dropped collection: ${collection}`);
        } else {
          console.log(`Collection ${collection} does not exist`);
        }
      } catch (error) {
        console.error(`Error dropping collection ${collection}:`, error);
      }
    }
    
    console.log('Collection drop operations completed');
    
    // Disconnect only if we connected in this function
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('Error dropping collections:', error);
  }
};

// Wrap in async IIFE to allow for top-level await
// (async () => {
//   try {
//     await dropCollections();
//     // Uncomment the following line if you want to re-insert data after dropping
//     // await runDataInsertProcess();
//   } catch (error) {
//     console.error('Error in database operations:', error);
//   }
// })();


runDataInsertProcess();