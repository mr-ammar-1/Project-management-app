const db = require('../models/db');
const bcrypt = require('bcrypt');

exports.authenticateUser = (req, res, next) => {
  const { email, password } = req.headers; // Get email and password from headers

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Query to get the user from the database by email
  db.get('SELECT * FROM Users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare provided password with the stored hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error verifying password' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      req.user = user; // Attach user info to the request object
      next(); // Proceed to the next middleware/route
    });
  });
};
