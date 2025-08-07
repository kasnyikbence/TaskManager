let $tasks = $('#tasks');
let $toDeleteId = null; // A törlendő feladat ID-ját tárolja
let $editId = null; // A szerkesztendő feladat ID-ját tárolja
let currentFilter = 'all';

$(document).ready(function () {
    renderTasks(currentFilter);
    setActiveFilter(currentFilter);

    // Filter gombok eseménykezelője
    $('.list-group-item-action').on('click', function (e) {
        e.preventDefault();
        const filterType = $(this).data('filter');
        currentFilter = filterType;
        setActiveFilter(filterType);
        renderTasks(currentFilter);
    });

    // Feladat hozzáadása
    $('#add').on('click', function () {
        const name = $('#name').val().trim();
        const description = $('#description').val().trim();
        const deadline = $('#deadline').val();
        const time = $('#time').val();

        if (!name || !description || !deadline || !time) {
            alert("Please fill in all fields!");
            return;
        }

        const tasks = loadTasks();
        const newTask = {
            id: Date.now(), // Egyedi azonosító hozzáadása
            name,
            description,
            deadline,
            time,
            done: false
        };
        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks(currentFilter);

        $('#name, #description, #deadlinem, #time').val('');
        bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
    });

    // Szerkesztés gomb kattintása
    $tasks.on('click', '.btn-edit', function () {
        $editId = $(this).closest('.list-group-item').data('id');
        const tasks = loadTasks();
        const taskToEdit = tasks.find(task => task.id === $editId);

        if (taskToEdit) {
            $('#new-name').val(taskToEdit.name);
            $('#new-description').val(taskToEdit.description);
            $('#new-deadline').val(taskToEdit.deadline);
            $('#new-time').val(taskToEdit.time);
        }
    });

    // Szerkesztés mentése
    $('#edit').on('click', function () {
        const name = $('#new-name').val().trim();
        const description = $('#new-description').val().trim();
        const deadline = $('#new-deadline').val();
        const time = $('#new-time').val();

        const tasks = loadTasks();
        const taskIndex = tasks.findIndex(task => task.id === $editId);

        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                name,
                description,
                deadline,
                time
            };
            saveTasks(tasks);
            renderTasks(currentFilter);
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        }
    });

    // Checkbox eseménykezelő
    $tasks.on('change', '.form-check-input', function () {
        const taskId = $(this).closest('.list-group-item').data('id');
        const tasks = loadTasks();
        const taskToUpdate = tasks.find(task => task.id === taskId);

        if (taskToUpdate) {
            taskToUpdate.done = this.checked;
            saveTasks(tasks);
            renderTasks(currentFilter);
        }
    });

    // Törlés gomb kattintása
    $tasks.on('click', '.btn-delete', function () {
        $toDeleteId = $(this).closest('.list-group-item').data('id');
    });

    // Törlés megerősítése (Yes)
    $('.btn-yes').on('click', function () {
        if ($toDeleteId !== null) {
            const tasks = loadTasks();
            const indexToDelete = tasks.findIndex(task => task.id === $toDeleteId);

            if (indexToDelete !== -1) {
                tasks.splice(indexToDelete, 1);
                saveTasks(tasks);
                renderTasks(currentFilter);
                $toDeleteId = null;
                bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
            }
        }
    });

    // Dark Mode váltása
    const toggleDark = document.getElementById('toggleDark');
    const lightIcon = document.querySelector('.light-mode-icon');
    const darkIcon = document.querySelector('.dark-mode-icon');

    function setDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
            lightIcon.classList.add('d-none');
            darkIcon.classList.remove('d-none');
        } else {
            document.body.classList.remove('dark-mode');
            lightIcon.classList.remove('d-none');
            darkIcon.classList.add('d-none');
        }
    }

    toggleDark.addEventListener('click', () => {
        const isDarkMode = !document.body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode', isDarkMode);
        setDarkMode(isDarkMode);
    });

    window.addEventListener('DOMContentLoaded', () => {
        const isDark = localStorage.getItem('dark-mode') === 'true';
        setDarkMode(isDark);
    });
});

function loadTasks() {
    const tasksJson = localStorage.getItem('tasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(currentFilter) {
    const tasks = loadTasks();
    $tasks.empty();

    let filteredTasks;
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.done);
    } else if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.done);
    } else {
        filteredTasks = tasks;
    }

    if (filteredTasks.length === 0) {
        $tasks.html('<p class="text-center mt-5">No tasks found.</p>');
    } else {
        filteredTasks.forEach(task => {
            const taskHtml = `
                    <div class="list-group-item d-flex justify-content-between align-items-center bg-white text-dark border-secondary mb-2" data-id="${task.id}">
                        <div class="d-flex align-items-center">
                            <input class="form-check-input me-3" type="checkbox" ${task.done ? 'checked' : ''} data-id="${task.id}">
                            <div class="d-flex flex-column">
                                <span class="task-title">${task.name}</span>
                                <small class="task-description">${task.description}</small>
                                <small class="task-deadline">Due: ${task.deadline} - ${task.time}</small>
                            </div>
                        </div>
                        
                        <div class="d-flex flex-column align-items-center">
                            <span class="task-status ${task.done ? 'done' : 'not-done'} mb-2">
                                ${task.done ? '✔ Completed' : '❌ Pending'}
                            </span>
                            <div class="d-flex">
                                <a href="#" class="btn-edit text-dark me-3" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#editModal">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <a href="#" class="btn-delete text-danger" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                    <i class="fas fa-trash-alt"></i>
                                </a>
                            </div>
                        </div>
                    </div>
            `;
            $tasks.append(taskHtml);
        });
    }
}

function setActiveFilter(filter) {
    $('.list-group-item-action').removeClass('active');
    $(`.list-group-item-action[data-filter="${filter}"]`).addClass('active');
}