import mongoose from 'mongoose';
import { KudosCategoryModel } from '../infrastructure/database/models/KudosCategoryModel';
import { TeamModel } from '../infrastructure/database/models/TeamModel';
import { KudosModel } from '../infrastructure/database/models/KudosModel';
import dotenv from 'dotenv';

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
      { name: 'Engineering' },
      { name: 'Product Management' },
      { name: 'Design' },
      { name: 'Marketing' },
      { name: 'Sales' },
      { name: 'Customer Support' },
      { name: 'Human Resources' },
      { name: 'Finance' },
      { name: 'Operations' },
      { name: 'Research & Development' }
    ];

    await TeamModel.insertMany(teams);
    console.log(`Successfully inserted ${teams.length} teams`);
  } catch (error) {
    console.error('Error inserting team data:', error);
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
        icon: 'users',
        color: '#3498db'
      },
      {
        name: 'INNOVATION',
        description: 'Recognition for creative solutions and innovative thinking',
        icon: 'lightbulb',
        color: '#9b59b6'
      },
      {
        name: 'EXCELLENCE',
        description: 'Recognition for outstanding performance and quality work',
        icon: 'star',
        color: '#f1c40f'
      },
      {
        name: 'LEADERSHIP',
        description: 'Recognition for guiding others and leading by example',
        icon: 'trophy',
        color: '#e74c3c'
      },
      {
        name: 'HELPFULNESS',
        description: 'Recognition for providing support and assistance to others',
        icon: 'hands-helping',
        color: '#2ecc71'
      },
      {
        name: 'PROBLEM_SOLVING',
        description: 'Recognition for effectively solving complex problems',
        icon: 'puzzle-piece',
        color: '#e67e22'
      },
      {
        name: 'MENTORSHIP',
        description: 'Recognition for guiding and developing others',
        icon: 'chalkboard-teacher',
        color: '#1abc9c'
      },
      {
        name: 'DEDICATION',
        description: 'Recognition for commitment and going above and beyond',
        icon: 'fire',
        color: '#d35400'
      },
      {
        name: 'COMMUNICATION',
        description: 'Recognition for clear and effective communication',
        icon: 'comments',
        color: '#27ae60'
      },
      {
        name: 'INITIATIVE',
        description: 'Recognition for taking initiative and proactive approach',
        icon: 'flag',
        color: '#8e44ad'
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
    const categories = await KudosCategoryModel.find().select('_id');
    if (categories.length === 0) {
      console.log('No categories found. Please insert categories first.');
      return;
    }

    // User IDs provided
    const receiverIds = [
      '68288986db9addbe5a4900f4',
      '68288a25db9addbe5a4900fb'
    ];
    const senderId = '68288abbdb9addbe5a490101';
    
    // Team IDs provided
    const teamIds = [
      '68286739c762b78cce0edfe4',
      '68286743c762b78cce0edfea',
      '68286747c762b78cce0edfed'
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
      const categoryId = categories[i % categories.length]._id;
      
      kudosData.push({
        senderId: new mongoose.Types.ObjectId(senderId),
        receiverId: new mongoose.Types.ObjectId(receiverId),
        categoryId: categoryId,
        teamId: new mongoose.Types.ObjectId(teamId),
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
runDataInsertProcess()