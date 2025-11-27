import express from 'express';
import cheerio from 'cheerio';
import { fetchHtml } from '../utils/fetcher.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url' });

    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    // Look for <video src=> or content in JSONLD
    let videoUrl = $('video').attr('src');

    if (!videoUrl) {
      // try to find by JSONLD
      const ld = $('script[type="application/ld+json"]').html();
      if (ld) {
        try {
          const parsed = JSON.parse(ld);
          if (parsed?.contentUrl) videoUrl = parsed.contentUrl;
        } catch (e) {}
      }
    }

    if (!videoUrl) {
      // fallback regex
      const m = html.match(/"contentUrl":"(https?:\\/\\/[^"]+)"/);
      if (m) videoUrl = m[1].replace(/\\u0026/g, '&');
    }

    if (!videoUrl) return res.status(500).json({ error: 'LinkedIn extraction failed' });

    return res.json({ download_url: videoUrl });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'LinkedIn extraction failed' });
  }
});

export default router;