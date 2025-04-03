# Project Management Application

## Overview
This project is a web-based project management application that allows users to create tasks, allocate deadlines, send reminders, and provide updates. The application is designed to help teams manage their projects efficiently.

## Project Structure
```
project-management-app
├── src
│   ├── index.html          # Main HTML document for the application
│   ├── styles
│   │   └── style.css       # CSS styles for the application
│   ├── scripts
│   │   └── app.js          # JavaScript code for handling user interactions
│   └── database
│       └── schema.sql      # SQL schema for the database
├── package.json             # Configuration file for npm
└── README.md                # Documentation for the project
```

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- A web browser for testing the application.

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd project-management-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
1. Open `src/index.html` in your web browser to view the application.
2. Use the provided forms to create tasks, allocate deadlines, and send reminders.

## Features
- Create tasks with descriptions and deadlines.
- Allocate tasks to users.
- Send reminders for upcoming deadlines.
- Update task statuses.

## Database Schema
The database schema is defined in `src/database/schema.sql`. It includes tables for tasks, users, and deadlines.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.