import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tiktokRouter from "./routes/tiktok.js";
import instagramRouter from "./routes/instagram.js";
import linkedinRouter from "./routes/linkedin.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/download/tiktok", tiktokRouter);
app.use("/download/instagram", instagramRouter);
app.use("/download/linkedin", linkedinRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
