// Array para armazenar as tarefas
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Carregar tarefas ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});

// Função para adicionar tarefa
function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    input.value = '';
}

// Função para remover tarefa
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Função para alternar status da tarefa
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Função para filtrar tarefas
function filterTasks(filter) {
    currentFilter = filter;
    
    // Atualizar botões ativos
    document.getElementById('filterAll').classList.remove('active');
    document.getElementById('filterPending').classList.remove('active');
    document.getElementById('filterCompleted').classList.remove('active');
    
    if (filter === 'all') {
        document.getElementById('filterAll').classList.add('active');
    } else if (filter === 'pending') {
        document.getElementById('filterPending').classList.add('active');
    } else if (filter === 'completed') {
        document.getElementById('filterCompleted').classList.add('active');
    }
    
    renderTasks();
}

// Função para limpar tarefas concluídas
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Função para renderizar tarefas
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li style="text-align: center; color: #666; padding: 20px;">Nenhuma tarefa encontrada</li>';
    } else {
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${task.id})">
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Excluir</button>
            `;
            
            taskList.appendChild(li);
        });
    }
    
    updateTaskCount();
}

// Função para atualizar contador de tarefas
function updateTaskCount() {
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const taskCount = document.getElementById('taskCount');
    
    if (pendingTasks === 0) {
        taskCount.textContent = 'Nenhuma tarefa pendente';
    } else if (pendingTasks === 1) {
        taskCount.textContent = '1 tarefa pendente';
    } else {
        taskCount.textContent = `${pendingTasks} tarefas pendentes`;
    }
}

// Função para salvar no localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}