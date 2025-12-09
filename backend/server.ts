import 'dotenv/config';
import http from 'http';
import app from './app';
import connectDB from './src/config/db';
import { registerTelegramWebhook, getTelegramWebhookInfo } from './src/utils/telegramWebhook';

const PORT = process.env.PORT || 4000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    
    // Register Telegram webhook on server startup
    const webhookRegistered = await registerTelegramWebhook();
    
    // Show current webhook info for debugging
    if (webhookRegistered) {
      await getTelegramWebhookInfo();
    }
    
    const server = http.createServer(app);
    
    // Handle server errors (like port already in use)
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use!`);
        console.error(`   Another process is using port ${PORT}`);
        console.error(`   Solution: Kill the process or use a different port\n`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });
    
    server.listen(PORT, () => {
      console.log(`✅ Backend running on port ${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to start server:', errorMessage);
    process.exit(1);
  }
};

startServer();

