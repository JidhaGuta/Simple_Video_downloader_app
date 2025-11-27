import express from 'express';
import cheerio from 'cheerio';
import { fetchHtml } from '../utils/fetcher.js';

const router = express.Router();

// POST { url }
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url' });

    // Basic fetch + search for video tag
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    // Many TikTok pages include JSON in a <script id="__NEXT_DATA__"> or meta tags
    // Try to find <video> first
    let videoUrl = $('video').attr('src');

    if (!videoUrl) {
      // fallback: extract JSON from script tags
      const scripts = $('script');
      let found = null;
      scripts.each((i, el) => {
        const html = $(el).html() || '';
        if (html.includes('VideoModule')) found = html;
        if (html.includes('playAddr')) found = html;
      });
      if (found) {
        const m = found.match(/"playAddr":"(https?:\\/\\/[^"]+)"/);
        if (m) videoUrl = m[1].replace(/\\u0026/g, '&').replace(/\\/g, '');
      }
    }

    if (!videoUrl) return res.status(500).json({ error: 'Could not extract video URL' });

    return res.json({ download_url: videoUrl });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'TikTok extraction failed' });
  }
});

export default router;