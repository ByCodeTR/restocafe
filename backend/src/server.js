const { app, httpServer } = require('./app');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;

// Start server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 