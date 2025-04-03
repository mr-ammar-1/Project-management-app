-- 1. Users Table (No Global Role)
CREATE TABLE Users (
    user_id        TEXT PRIMARY KEY,  -- UUID
    username       TEXT UNIQUE NOT NULL,
    email          TEXT UNIQUE NOT NULL,
    password       TEXT NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects Table
CREATE TABLE Projects (
    project_id  TEXT PRIMARY KEY,  -- UUID
    name        TEXT NOT NULL,
    description TEXT,
    created_by  TEXT NOT NULL,  -- FK to Users
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status      TEXT CHECK (status IN ('active', 'archived')) NOT NULL,
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE CASCADE
);


-- 4. Tasks Table
CREATE TABLE Tasks (
    task_id      TEXT PRIMARY KEY,  -- UUID
    title        TEXT NOT NULL,
    description  TEXT,
    status       TEXT CHECK (status IN ('todo', 'in_progress', 'completed', 'archived')) NOT NULL,
    due_date     TIMESTAMP NOT NULL,
    created_by   TEXT NOT NULL,  -- FK to Users (must be admin of the project)
    project_id   TEXT NOT NULL,  -- FK to Projects
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    completed_by TEXT,  -- FK to Users (employee who completed it)
    assignee_id  TEXT ,  -- FK to Users (employee)
    allocated_by TEXT ,  -- FK to Users (admin)
    allocated_at TIMESTAMP,


    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (completed_by) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


-- 6. Notifications Table
CREATE TABLE Notifications (
    notification_id  TEXT PRIMARY KEY,  -- UUID
    user_id         TEXT NOT NULL,  -- FK to Users
    message         TEXT NOT NULL,
    type            TEXT CHECK (type IN ('assignment', 'reminder')) NOT NULL,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    related_task_id TEXT,  -- FK to Tasks (optional)
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (related_task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE
);
