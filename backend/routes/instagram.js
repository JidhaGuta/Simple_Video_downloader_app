import express from "express";
import { fetchHtml, fetchJson } from "../utils/fetcher.js";

const router = express.Router();

// POST { url }
router.post("/", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Missing url" });

    // Instagram unofficial JSON endpoint (may break)
    // Append ?__a=1&__d=dis to try to get JSON
    const jsonUrl = url + (url.includes("?") ? "&" : "?") + "__a=1&__d=dis";
    try {
      const data = await fetchJson(jsonUrl);
      // data may contain graphql.shortcode_media
      if (data?.graphql?.shortcode_media?.video_url) {
        return res.json({
          download_url: data.graphql.shortcode_media.video_url,
        });
      }
      // Carousel or image
      const maybeVideo = data?.items?.[0]?.video_versions?.[0]?.url;
      if (maybeVideo) return res.json({ download_url: maybeVideo });
    } catch (e) {
      // fallback to HTML scraping
      const html = await fetchHtml(url);
      const vMatch = html.match(/"video_url":"([^"]+)"/);
      if (vMatch) {
        const videoUrl = vMatch[1].replace(/\\u0026/g, "&");
        return res.json({ download_url: videoUrl });
      }
    }

    return res.status(500).json({ error: "Instagram extraction failed" });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: "Instagram extraction failed" });
  }
});

export default router;
