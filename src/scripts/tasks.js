document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    fetchAllTasks();
    fetchProjects();
    fetchAssignees();
   
});

function fetchAllTasks() {
    
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    
    fetch(`http://localhost:3000/tasks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        }
    })
    .then(response => response.json())
    .then(tasks => {
        const taskContainer = document.getElementById('taskContainer');
        taskContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.textContent = `${task.title} - ${task.status}`;
            taskContainer.appendChild(taskElement);
        });
    })
    .catch(error => console.error('Error fetching tasks:', error));
}

function fetchProjects() {
    
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    fetch('http://localhost:3000/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        }
    })
    .then(response => response.json())
    .then(projects => {
        const projectDropdown = document.getElementById('projectDropdown');
        projectDropdown.innerHTML = '';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.project_id;
            option.textContent = project.name;
            projectDropdown.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching projects:', error));
}


function fetchTasks() {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    fetch('http://localhost:3000/tasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        }
    })
    .then(response => response.json())
    .then(tasks => {
        renderTasks(tasks);
    })
    .catch(error => console.error('Error fetching tasks:', error));
}

// Render Tasks in List
function renderTasks(tasks) {
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.title} - ${task.status}`;
        li.setAttribute("data-status", task.status.toLowerCase());  // Store status for filtering
        taskContainer.appendChild(li);
    });
}

// Filter Tasks Based on Search and Status
function filterTasks() {
    const searchQuery = document.getElementById('taskSearch').value.toLowerCase();
    const filterStatus = document.getElementById('taskFilter').value;

    document.querySelectorAll('#taskContainer li').forEach(task => {
        const text = task.textContent.toLowerCase(); // Example: "Buy groceries - Pending"
        const [title, status] = text.split(" - ");
        
        console.log(title); // "Buy groceries"
        console.log(status); // "Pending"
        // console.log(status);

        // Show task if it matches search query and selected status
        if (title.includes(searchQuery) && (filterStatus === "all" || status === filterStatus)) {
            task.style.display = "list-item";
        } else {
            task.style.display = "none";
        }
    });
}


function fetchAssignees() {
    
    fetch('http://localhost:3000/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
         
          
        }
    })
        .then(response => response.json())
        .then(users => {
            const assigneeDropdown = document.getElementById('assigneeId');
            assigneeDropdown.innerHTML = '';
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.user_id;
                option.textContent = user.username;
                assigneeDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}
function assignTask() {
    const taskId = document.getElementById('taskId').value;
    const assigneeId = document.getElementById('assigneeId').value;
    const allocatedBy = localStorage.getItem("email");

    const taskData = {
        task_id: taskId,
        assignee_id: assigneeId,
        allocated_by: allocatedBy
    };

    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    fetch('http://localhost:3000/tasks/assign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Task assigned successfully, notification sent') {
            alert('Task assigned successfully');
        } else {
            console.error('Error assigning task:', data.message);
        }
    })
    .catch(error => console.error('Error assigning task:', error));
}
function addTask() {
    const taskInput = document.getElementById('taskInput').value;
    const projectDescription = document.getElementById('projectDescription').value;
    const dueDate = document.getElementById('dueDate').value;
    const taskStatus = document.getElementById('taskStatus').value;
    const projectId = document.getElementById('projectDropdown').value;

    const taskData = {
        title: taskInput,
        description: projectDescription,
        status: taskStatus,
        due_date: dueDate,
        created_by: localStorage.getItem('email'), // Assume user ID is stored in localStorage
        project_id: projectId,
    };

    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            email: email,
            password: password
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Task added successfully') {
            alert('Task added successfully');
            fetchTasks();
        } else {
            console.error('Error adding task:', data.message);
        }
    })
    .catch(error => console.error('Error adding task:', error));
}

function getProjectIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('project_id');
}