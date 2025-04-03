const db = require('../models/db');
const { v4: uuidv4 } = require('uuid'); // Import UUID
const bcrypt = require('bcrypt'); // For password hashing

// Add User
exports.addUser = (req, res) => {
  const user_id = uuidv4();
  const { username, email, password } = req.body;

  console.log(req.body);

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }
    db.run(
      'INSERT INTO Users (user_id, username, email, password) VALUES (?, ?, ?, ?)',
      [user_id, username, email, hash],
      function (err) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ message: 'User added successfully', user_id });
      }
    );
  });
};


// Update User
exports.updateUser = (req, res) => {
  const { user_id, username, email } = req.body;
  // Hash the provided password
  
  
    // Update the user in the database with the new password
    db.run(
      'UPDATE Users SET username = ?, email = ? WHERE user_id = ?',
      [username, email, user_id],
      function (err) {
        if (err) {
          return res.status(500).json({ message: 'Error updating user' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
      }
    );

};

// Delete User
exports.deleteUser = (req, res) => {
  const { user_id } = req.body;

  db.run('DELETE FROM Users WHERE user_id = ?', [user_id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting user' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
};

// Get All Users
exports.getAllUsers = (req, res) => {
  db.all('SELECT user_id, username, email, created_at FROM Users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching users' });
    }
    res.status(200).json(rows);
  });
};

// User Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM Users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error verifying password' });
      }
      if (!result) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      const { password, ...userInfo } = user;
      res.status(200).json({ message: 'Login successful', user: userInfo });
    });
  });
}


// Get Notifications by User ID
exports.getNotificationsByUserId = (req, res) => {
  const { user_id } = req.params;

  db.all('SELECT * FROM Notifications WHERE user_id = ?', [user_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching notifications' });
    }
    res.status(200).json(rows);
  });
};


exports.markNotificationsAsRead = (req, res) => {
  const { user_id  , notification_id} = req.body;

  db.run(
    'UPDATE Notifications SET is_read = ? WHERE user_id = ? and notification_id = ?',
    [true, user_id , notification_id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating notifications' });
      }
      res.status(200).json({ message: 'Notifications marked as read' });
    }
  );
};

exports.getNotificationsByEmail = (req, res) => {
  const { email } = req.params;
  console.log(email);

  db.all(
    `SELECT Notifications.* FROM Notifications
     JOIN Users ON Notifications.user_id = Users.user_id
     WHERE Users.email = ? ORDER BY Notifications.created_at DESC`,
    [email],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching notifications' });
      }
      res.status(200).json(rows);
    }
  );
};



