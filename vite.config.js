import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom TTS proxy plugin - fetches Google Translate audio server-side
function ttsProxyPlugin() {
  return {
    name: 'tts-proxy',
    configureServer(server) {
      server.middlewares.use('/tts-api', async (req, res) => {
        try {
          const url = new URL(req.url, 'http://localhost');
          const text = url.searchParams.get('q') || '';
          const lang = url.searchParams.get('tl') || 'en';

          const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob&ttsspeed=1`;

          const response = await fetch(ttsUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Referer': 'https://translate.google.com/',
            }
          });

          if (!response.ok) {
            res.statusCode = response.status;
            res.end('TTS fetch failed');
            return;
          }

          const buffer = Buffer.from(await response.arrayBuffer());
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Content-Length', buffer.length);
          res.end(buffer);
        } catch (err) {
          console.error('[TTS Proxy Error]', err.message);
          res.statusCode = 500;
          res.end('TTS proxy error');
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ttsProxyPlugin()],
})
