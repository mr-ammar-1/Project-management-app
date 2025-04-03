const express = require('express');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


// Enable CORS
app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use routes
app.use(userRoutes);
app.use(projectRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
