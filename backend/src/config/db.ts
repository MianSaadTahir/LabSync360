import mongoose from 'mongoose';
import { Message, Meeting, Budget, BudgetAllocation } from '../models';

const connectDB = async (): Promise<void> => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    
    // Ensure indexes are created
    await Promise.all([
      Message.createIndexes(),
      Meeting.createIndexes(),
      Budget.createIndexes(),
      BudgetAllocation.createIndexes(),
    ]);
    console.log('Database indexes created');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('MongoDB connection error:', errorMessage);
    throw error;
  }
};

export default connectDB;

