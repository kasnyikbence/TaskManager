let $tasks = $('#tasks');

$(document).ready(function () {
    $('#add').on('click', function () {
        const name = $('#name').val().trim();
        const description = $('#description ').val().trim();
        const deadline = $('#deadline').val();

        if (!name || !description || !deadline) {
            alert("Please fill in all fields!");
            return;
        }

        const tasks = `<div class="task-card">
        <div class="task-header">
            <span class="task-title">${name}</span>
            <div class="task-status-group">
                <span class="task-status not-done">❌ Not Done</span>
            </div>
        </div>

        <div class="task-body">
            <p class="description">${description}</p>
            <p class="task-deadline"> Deadline: ${deadline}</p>
        </div>

        <div class="task-actions">
            <button type="button" class="btn-done">✔ Mark as done</button>
            <button type="button" class="btn-delete" data-bs-toggle="modal" data-bs-target="#deleteModal">
            <img src="assets/bin.png" width="20" height="20" alt="Delete">
            </button>
        </div>
    </div>
    `;

        $('#tasks').append(tasks);
        $('#name, #description, #deadline').val('');
        const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
        addModal.hide();
    })

    $tasks.on('click', '.btn-done', function () {
        const $taskCard = $(this).closest('.task-card');
        const $status = $taskCard.find('.task-status');
        const $button = $(this);

        if ($status.hasClass('not-done')) {
            $status
                .removeClass('not-done')
                .addClass('done')
                .text('✔ Done')
            $button.hide();
        } else {
            $status
                .removeClass('done')
                .addClass('not-done')
        }
    });

    $tasks.on('click', '.btn-delete', function(){
        $toDelete = $(this).closest('.task-card');
    });
    
    $('.btn-yes').on('click', function(){
        if($toDelete){
            $toDelete.remove();
            $toDelete = null;
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
        }
    });

})