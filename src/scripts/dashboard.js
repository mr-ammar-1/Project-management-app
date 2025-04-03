document.addEventListener('DOMContentLoaded', () => {
    fetchAllTasks();
   
    
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
        const activeTasksCount = tasks.filter(task => task.status !== 'completed').length;
        const completedTasksCount = tasks.filter(task => task.status === 'completed').length;

        document.querySelector('.card:nth-child(1) p').textContent = activeTasksCount;
        document.querySelector('.card:nth-child(2) p').textContent = completedTasksCount;
    })
    .catch(error => console.error('Error fetching tasks:', error));
}
