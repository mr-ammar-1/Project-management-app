const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');

// Add Project
exports.addProject = (req, res) => {
  const project_id = uuidv4();
  const { name, description, created_by, status } = req.body;

  db.run(
    'INSERT INTO Projects (project_id, name, description, created_by, status) VALUES (?, ?, ?, ?, ?)',
    [project_id, name, description, created_by, status],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error adding project' });
      }
      res.status(201).json({ message: 'Project added successfully', project_id });
    }
  );
};

// Delete Project
exports.deleteProject = (req, res) => {
  const { project_id } = req.params;

  db.run('DELETE FROM Projects WHERE project_id = ?', [project_id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting project' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  });
};

// Get All Projects
exports.getAllProjects = (req, res) => {
  db.all('SELECT * FROM Projects', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching projects' });
    }
    res.status(200).json(rows);
  });
};

// Get Project by ID
exports.getProjectById = (req, res) => {
  const { project_id } = req.params;

  db.get('SELECT * FROM Projects WHERE project_id = ?', [project_id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching project' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(row);
  });
};

// Add Task
exports.addTask = (req, res) => {
 console.log('Add Task', req.body);
  const task_id = uuidv4();
  const created_at = new Date().toISOString();
  const { title, description, status, due_date, created_by, project_id } = req.body;

  db.run(
    'INSERT INTO Tasks (task_id, title, description, status, due_date, created_by, project_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [task_id, title, description, status, due_date, created_by, project_id, created_at],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error adding task' });
      }
      res.status(201).json({ message: 'Task added successfully', task_id });
    }
  );
};
exports.getAllTasks = (req, res) => {
  db.all('SELECT * FROM Tasks', [], (err, rows) => {
      if (err) {
          return res.status(500).json({ message: 'Error fetching tasks' });
      }
      res.status(200).json(rows);
  });
};

// Update Task
exports.updateTaskStatus = (req, res) => {
  console.log('Update Task', req.body);
  const { task_id, status, completed_by } = req.body;
  const completed_at = status === 'completed' ? new Date().toISOString() : null;
  db.run(
    'UPDATE Tasks SET status = ?, completed_at = ?, completed_by = ? WHERE task_id = ?',
    [status, completed_at, completed_by, task_id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating task status' });
      }
      res.status(200).json({ message: 'Task status updated successfully' });
    }
  );
};
// Change Task Status
exports.assignTask = (req, res) => {
  console.log(req.body);
  const { task_id, assignee_id, allocated_by } = req.body;
  const allocated_at = new Date().toISOString();
  const notification_id = uuidv4();

  db.run(
    'UPDATE Tasks SET assignee_id = ?, allocated_by = ?, allocated_at = ? WHERE task_id = ?',
    [assignee_id, allocated_by, allocated_at, task_id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error assigning task' });
      }

      // Fetch the task title for notification
      db.get('SELECT title FROM Tasks WHERE task_id = ?', [task_id], (err, row) => {
        if (err || !row) {
          return res.status(500).json({ message: 'Task assigned but error retrieving task info' });
        }

        const message = `You have been assigned a new task: ${row.title}`;

        // Insert notification
        db.run(
          'INSERT INTO Notifications (notification_id, user_id, message, type, is_read, created_at, related_task_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [notification_id, assignee_id, message, 'assignment', false, new Date().toISOString(), task_id],
          function (err) {
            if (err) {
              return res.status(500).json({ message: 'Task assigned but notification failed' });
            }
            res.status(200).json({ message: 'Task assigned successfully, notification sent' });
          }
        );
      });
    }
  );
};
// Get Tasks by Project ID
exports.getTasksByProjectId = (req, res) => {
  const { project_id } = req.params;

  db.all('SELECT * FROM Tasks WHERE project_id = ?', [project_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching tasks' });
    }
    res.status(200).json(rows);
  });
};

// Get Task by ID
exports.getTaskById = (req, res) => {
  const { task_id } = req.params;

  db.get('SELECT * FROM Tasks WHERE task_id = ?', [task_id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching task' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(row);
  });
};

exports.getTasksDueTomorrowByEmail = (req, res) => {
  const { email } = req.params;

  // Step 1: Get user_id from email
  db.get('SELECT user_id FROM Users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user_id = user.user_id;
    console.log(user)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Step 2: Fetch tasks where due_date is tomorrow and assigned to this user
    db.all(
      'SELECT * FROM Tasks WHERE assignee_id = ? AND due_date = ?',
      [user_id, formattedTomorrow],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching tasks' });
        }
        res.status(200).json(rows);
      }
    );
  });
};