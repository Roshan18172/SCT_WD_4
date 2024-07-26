document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskDateTime = document.getElementById('task-date-time');
  const taskList = document.getElementById('task-list');

  taskForm.addEventListener('submit', addTask);

  function addTask(e) {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    const taskDate = taskDateTime.value;
    if (taskText !== '' && taskDate !== '') {
      const task = {
        id: Date.now(),
        text: taskText,
        dateTime: taskDate,
        completed: false
      };
      renderTask(task);
      saveTask(task);
      taskInput.value = '';
      taskDateTime.value = '';
    }
  }

  function renderTask(task) {
    const taskItem = document.createElement('li');
    taskItem.setAttribute('data-id', task.id);

    const taskContent = document.createElement('span');
    taskContent.textContent = `${task.text} (Due: ${new Date(task.dateTime).toLocaleString()})`;

    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('complete');
    completeButton.addEventListener('click', () => completeTask(task.id));

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit');
    editButton.addEventListener('click', () => editTask(task.id));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    taskActions.appendChild(completeButton);
    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);

    taskItem.appendChild(taskContent);
    taskItem.appendChild(taskActions);

    if (task.completed) {
      taskItem.classList.add('completed');
    }

    taskList.appendChild(taskItem);
  }

  function completeTask(id) {
    const taskItem = document.querySelector(`li[data-id='${id}']`);
    taskItem.classList.toggle('completed');
    const taskText = taskItem.querySelector('span').textContent;
    updateTask(id, { completed: taskItem.classList.contains('completed') });
  }

  function editTask(id) {
    const taskItem = document.querySelector(`li[data-id='${id}']`);
    const taskText = prompt('Edit the task:', taskItem.querySelector('span').textContent);
    if (taskText !== null && taskText.trim() !== '') {
      updateTask(id, { text: taskText });
      taskItem.querySelector('span').textContent = taskText;
    }
  }

  function deleteTask(id) {
    document.querySelector(`li[data-id='${id}']`).remove();
    removeTask(id);
  }

  function saveTask(task) {
    let tasks = localStorage.getItem('tasks');
    tasks = tasks ? JSON.parse(tasks) : [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function updateTask(id, updates) {
    let tasks = localStorage.getItem('tasks');
    tasks = tasks ? JSON.parse(tasks) : [];
    tasks = tasks.map(task => task.id === id ? { ...task, ...updates } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function removeTask(id) {
    let tasks = localStorage.getItem('tasks');
    tasks = tasks ? JSON.parse(tasks) : [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
    let tasks = localStorage.getItem('tasks');
    tasks = tasks ? JSON.parse(tasks) : [];
    tasks.forEach(task => renderTask(task));
  }

  loadTasks();
});
