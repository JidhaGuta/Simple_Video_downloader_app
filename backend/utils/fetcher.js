import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const DEFAULT_UA =
  process.env.USER_AGENT || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

export async function fetchHtml(url) {
  const res = await axios.get(url, {
    headers: {
      "User-Agent": DEFAULT_UA,
      Accept: "text/html,application/xhtml+xml,application/xml",
    },
    timeout: 15000,
  });
  return res.data;
}

export async function fetchJson(url) {
  const res = await axios.get(url, {
    headers: { "User-Agent": DEFAULT_UA },
    timeout: 15000,
  });
  return res.data;
}
