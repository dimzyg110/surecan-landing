import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Parse JSON bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  const { default: referralsRouter } = await import("./routes/referrals.js");
  const { default: pharmacyRouter } = await import("./routes/pharmacy.js");
  const { default: leadsRouter } = await import("./routes/leads.js");
  const { default: qrCodesRouter } = await import("./routes/qrcodes.js");
  app.use("/api/referrals", referralsRouter);
  app.use("/api/pharmacy-partnership", pharmacyRouter);
  app.use("/api/leads", leadsRouter);
  app.use("/api/qrcodes", qrCodesRouter);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    // Skip API routes
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
