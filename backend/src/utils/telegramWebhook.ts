/**
 * Utility functions for Telegram webhook setup
 */

interface TelegramWebhookInfo {
  ok: boolean;
  result?: {
    url?: string;
    has_custom_certificate?: boolean;
    pending_update_count?: number;
    last_error_date?: number;
    last_error_message?: string;
    max_connections?: number;
    allowed_updates?: string[];
  };
  description?: string;
  error_code?: number;
}

/**
 * Extracts the webhook URL from TELEGRAM_WEBHOOK_URL environment variable
 * Supports two formats:
 * 1. Full Telegram API URL: https://api.telegram.org/bot{TOKEN}/setWebhook?url={WEBHOOK_URL}
 * 2. Direct webhook URL: https://your-domain.com/api/webhook/telegram
 * Returns the actual webhook URL that will receive Telegram updates
 */
export function extractWebhookUrl(): string | null {
  const webhookUrlEnv = process.env.TELEGRAM_WEBHOOK_URL;
  
  if (!webhookUrlEnv) {
    return null;
  }

  try {
    const url = new URL(webhookUrlEnv);
    
    // Check if it's a Telegram API URL (contains 'api.telegram.org')
    if (url.hostname.includes('api.telegram.org')) {
      // Extract the 'url' query parameter
      const webhookUrlParam = url.searchParams.get('url');
      if (webhookUrlParam) {
        return webhookUrlParam;
      }
    } else {
      // It's already a direct webhook URL
      return webhookUrlEnv;
    }
    
    return null;
  } catch (error) {
    // If URL parsing fails, it might be a malformed URL or invalid format
    console.error('[Telegram Webhook] Failed to parse webhook URL:', error);
    return null;
  }
}

/**
 * Registers the webhook URL with Telegram Bot API using YOUR bot token
 * This ensures the webhook is registered for YOUR bot, not someone else's
 */
export async function registerTelegramWebhook(): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = extractWebhookUrl();

  if (!botToken) {
    console.warn('[Telegram Webhook] TELEGRAM_BOT_TOKEN not found in environment variables');
    console.warn('   Make sure you set your bot token in the .env file');
    return false;
  }

  if (!webhookUrl) {
    console.warn('[Telegram Webhook] Webhook URL not found. Set TELEGRAM_WEBHOOK_URL environment variable.');
    console.warn('   Format: https://your-ngrok-url.ngrok-free.dev/api/webhook/telegram');
    return false;
  }

  try {
    // Use YOUR bot token to register the webhook
    // This ensures Telegram sends updates for YOUR bot to your webhook URL
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/setWebhook`;
    const fullUrl = `${telegramApiUrl}?url=${encodeURIComponent(webhookUrl)}`;
    
    console.log(`[Telegram Webhook] Registering webhook for your bot...`);
    console.log(`   Using bot token: ${botToken.substring(0, 10)}...`);
    console.log(`   Webhook URL: ${webhookUrl}`);
    console.log(`   Telegram API URL: ${telegramApiUrl}`);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP error! Status: ${response.status}`);
        console.error(`   Response: ${errorText}`);
        return false;
      }

      const data = await response.json() as { ok: boolean; description?: string; error_code?: number };

      if (data.ok) {
        console.log(`✅ Telegram webhook registered successfully for YOUR bot`);
        console.log(`   Bot token: ${botToken.substring(0, 10)}...`);
        console.log(`   Webhook URL: ${webhookUrl}`);
        console.log(`   Telegram will now send updates to your webhook endpoint`);
        return true;
      } else {
        console.error(`❌ Failed to register Telegram webhook:`, data.description || 'Unknown error');
        if (data.error_code) {
          console.error(`   Error code: ${data.error_code}`);
        }
        return false;
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`❌ Request timeout: Telegram API did not respond within 10 seconds`);
        console.error(`   Check your internet connection and try again`);
      } else {
        throw fetchError; // Re-throw to be caught by outer catch
      }
      return false;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Unknown';
    
    console.error(`❌ Error registering Telegram webhook:`, errorMessage);
    console.error(`   Error type: ${errorName}`);
    
    // Provide helpful troubleshooting tips
    if (errorMessage.includes('fetch failed') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ENOTFOUND')) {
      console.error(`\n💡 Troubleshooting tips:`);
      console.error(`   1. Check your internet connection`);
      console.error(`   2. Verify Telegram API is accessible: https://api.telegram.org`);
      console.error(`   3. Check if firewall/proxy is blocking the request`);
      console.error(`   4. Try manually registering: ${`https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`}\n`);
    }
    
    return false;
  }
}

/**
 * Gets the current webhook info for your bot
 * Useful for debugging and verifying webhook setup
 */
export async function getTelegramWebhookInfo(): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.warn('[Telegram Webhook] TELEGRAM_BOT_TOKEN not found');
    return;
  }

  try {
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/getWebhookInfo`;
    const response = await fetch(telegramApiUrl);
    const data = await response.json() as TelegramWebhookInfo;

    if (data.ok && data.result) {
      console.log('\n📋 Current Telegram Webhook Info:');
      console.log(`   URL: ${data.result.url || 'Not set'}`);
      console.log(`   Pending updates: ${data.result.pending_update_count || 0}`);
      if (data.result.last_error_message) {
        console.log(`   ⚠️  Last error: ${data.result.last_error_message}`);
        if (data.result.last_error_date) {
          const errorDate = new Date(data.result.last_error_date * 1000);
          console.log(`   Error date: ${errorDate.toLocaleString()}`);
        }
      }
      console.log('');
    } else {
      console.error('Failed to get webhook info:', data.description);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error getting webhook info:`, errorMessage);
  }
}

