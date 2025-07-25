let $tasks = $('#tasks');
let $toDelete = null;

$(document).ready(function () {
    renderTasks();

    $('#add').on('click', function () {
        const name = $('#name').val().trim();
        const description = $('#description').val().trim();
        const deadline = $('#deadline').val();

        if (!name || !description || !deadline) {
            alert("Please fill in all fields!");
            return;
        }

        const newTask = {
            name,
            description,
            deadline,
        };

        const tasks = loadTasks();
        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks();

        $('#name, #description, #deadline').val('');
        bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
    });

    let $editIndex = null;
    $tasks.on('click', '.btn-edit', function () {
        const index = $(this).data('index');
        const tasks = loadTasks();
        const task = tasks[index];

        $('#new-name').val(task.name);
        $('#new-description').val(task.description);
        $('#new-deadline').val(task.deadline);

        $editIndex = index;
    });

    $('#edit').on('click', function () {
        const name = $('#new-name').val().trim();
        const description = $('#new-description').val().trim();
        const deadline = $('#new-deadline').val();


        const tasks = loadTasks();
        tasks[$editIndex] = {
            ...tasks[$editIndex],
            name,
            description,
            deadline
        };
        saveTasks(tasks);
        renderTasks();

        // Modal bezárása
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
    });



    $tasks.on('click', '.btn-done', function () {
        const index = $(this).closest('.task-card').data('index');
        const tasks = loadTasks();
        tasks[index].done = true;
        saveTasks(tasks);
        renderTasks();
    });

    $tasks.on('click', '.btn-delete', function () {
        const index = $(this).closest('.task-card').data('index');
        $toDelete = index;
    });

    $('.btn-yes').on('click', function () {
        if ($toDelete !== null) {
            const tasks = loadTasks();
            tasks.splice($toDelete, 1);
            saveTasks(tasks);
            renderTasks();
            $toDelete = null;
            bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        }
    });


});


function loadTasks() {
    const tasksJson = localStorage.getItem('tasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const tasks = loadTasks();
    $tasks.empty();

    tasks.forEach((task, index) => {
        const taskHtml = `
            <div class="task-card" data-index="${index}">
                <div class="task-header">
                    <span class="task-title">${task.name}</span>
                    <button class="btn-pen btn-edit" data-index="${index}" data-bs-toggle="modal" data-bs-target="#editModal">
                        <img src="assets/pen.png" alt="Edit" width="20" height="20">
                    </button>
                    <div class="task-status-group">
                        <span class="task-status ${task.done ? 'done' : 'not-done'}">
                            ${task.done ? '✔ Done' : '❌ Not Done'}
                        </span>
                    </div>
                </div>
                <div class="task-body">
                    <p class="task-description">${task.description}</p>
                    <p class="task-deadline">Deadline: ${task.deadline}</p>
                </div>
                <div class="task-actions">
                    ${!task.done ? '<button type="button" class="btn-done">✔ Mark as done</button>' : ''}
                    <button type="button" class="btn-delete" data-bs-toggle="modal" data-bs-target="#deleteModal">
                        <img src="assets/bin.png" width="20" height="20" alt="Delete">
                    </button>
                </div>
            </div>
        `;
        $tasks.append(taskHtml);
    });
}

const toggleDark = document.getElementById('toggleDark');

toggleDark.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
});

window.addEventListener('DOMContentLoaded', () => {
    const isDark = localStorage.getItem('dark-mode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
});
