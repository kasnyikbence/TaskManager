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
            done: false
        };

        const tasks = loadTasks();
        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks();

        $('#name, #description, #deadline').val('');
        bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
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
        $toDelete = index; // csak az indexet mentjük
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
                    <div class="task-status-group">
                        <span class="task-status ${task.done ? 'done' : 'not-done'}">
                            ${task.done ? '✔ Done' : '❌ Not Done'}
                        </span>
                    </div>
                </div>
                <div class="task-body">
                    <p class="description">${task.description}</p>
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
