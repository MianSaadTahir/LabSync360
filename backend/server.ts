import 'dotenv/config';
import http from 'http';
import app from './app';
import connectDB from './src/config/db';

const PORT = process.env.PORT || 4000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to start server:', errorMessage);
    process.exit(1);
  }
};

startServer();

