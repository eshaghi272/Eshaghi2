// server.js
import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
http.createServer(app).listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
