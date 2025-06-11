import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();
app.use(helmet());
app.use(cors());
app.get("/health", (_, res) => res.json({ ok: true }));
app.listen(process.env.PORT || 3000);
