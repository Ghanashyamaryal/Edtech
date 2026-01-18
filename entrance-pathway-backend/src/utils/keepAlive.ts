import { env } from '../config';

const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

export function startKeepAlive(): void {
  const url = env.RENDER_EXTERNAL_URL;

  if (!url) {
    console.log('RENDER_EXTERNAL_URL not set, skipping keep-alive');
    return;
  }

  const healthUrl = `${url}/health`;

  const ping = async () => {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        console.log(`[Keep-Alive] Ping successful at ${new Date().toISOString()}`);
      } else {
        console.warn(`[Keep-Alive] Ping failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('[Keep-Alive] Ping error:', error);
    }
  };

  setInterval(ping, PING_INTERVAL);
  console.log(`[Keep-Alive] Started - pinging ${healthUrl} every 14 minutes`);
}
