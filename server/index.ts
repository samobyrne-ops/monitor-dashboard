import express from "express";
import path from "node:path";

const app = express();
const port = parseInt(process.env.PORT || "8080", 10);

app.use(express.json());
app.use(express.static(path.join(import.meta.dirname!, "..", "dist")));

app.get("*rest", (_req, res) => {
  res.sendFile(path.join(import.meta.dirname!, "..", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Monitor dashboard running on http://localhost:${port}`);
});
