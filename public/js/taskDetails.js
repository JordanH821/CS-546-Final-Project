let title, description, priority, dueDate, reminderDate, status, assignee, tags;

function disableInput() {
    $('input').attr('disabled', true);
    $('select').attr('disabled', true);
    $('textarea').attr('disabled', true);
}

function enableInput() {
    $('input').attr('disabled', false);
    $('select').attr('disabled', false);
    $('textarea').attr('disabled', false);
}

function disableForm() {
    disableInput();
    $('#updateTaskButton').hide();
    $('#editTaskButton').show();
    $('#cancelEditButton').hide();
}

function enableForm() {
    getOriginalTaskInfo();
    enableInput();
    $('#updateTaskButton').show();
    $('#editTaskButton').hide();
    $('#cancelEditButton').show();
}

function getOriginalTaskInfo() {
    title = $('#title').val().trim();
    description = $('#description').val().trim();
    priority = $('#priority').val().trim();
    dueDate = $('#dueDate').val().trim();
    reminderDate = $('#reminderDate').val().trim();
    status = $('#status').val().trim();
    assignee = $('#assignee').val().trim();
    tags = $('#tags').val().trim();
}

function cancelTaskUpdate() {
    $('#title').val(title);
    $('#description').val(description);
    $('#priority').val(priority);
    $('#dueDate').val(dueDate);
    $('#reminderDate').val(reminderDate);
    $('#status').val(status);
    $('#assignee').val(assignee);
    $('#tags').val(tags);
    clearErrors();
    disableForm();
}

function validateTaskUpdates() {
    $('#errorDiv').hide();
    $('#errorDiv').empty();
    validateStringInput($('#title').val().trim(), 'Title');
    validateStringInput($('#description').val().trim(), 'Description');
    validateSelect($('#priority').val().trim(), 'Priority');
    validateDate($('#dueDate').val().trim(), 'Due Date');
    validateDate($('#reminderDate').val().trim(), 'Reminder Date');
    validateSelect($('#status').val().trim(), 'Status');
    validateStringInput($('#assignee').val().trim(), 'Assignee');
    let strippedTags = validateTags($('#tags').val().trim());
    $('#tags').val(strippedTags.join(', '));
}

function getFormValues() {
    return {
        title: $('#title').val().trim(),
        description: $('#description').val().trim(),
        priority: $('#priority').val().trim(),
        dueDate: $('#dueDate').val().trim(),
        reminderDate: $('#reminderDate').val().trim(),
        status: $('#status').val().trim(),
        assignee: $('#assignee').val().trim(),
        tags: $('#tags').val().trim(),
    };
}

function handleAJAXError(error) {
    console.log(error);
    $('#errorDiv').append(
        `<p>There was an error while updating your Task. Please try again later.</p>`
    );
    $('#errorDiv').show();
}

function clearErrors() {
    $('#errorDiv').empty();
    $('#errorDiv').hide();
}

function updateTaskWithAJAX() {
    const id = $('#taskId').val().trim();
    const requestConfig = {
        method: 'POST',
        url: `/tasks/${id}`,
        data: JSON.stringify(getFormValues()),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: disableForm,
        error: handleAJAXError,
    };

    $.ajax(requestConfig);
}

$(disableForm);

$('#editTaskButton').on('click', enableForm);

$('#updateTaskButton').on('click', (event) => {
    event.preventDefault();
    try {
        validateTaskUpdates();
        disableForm();
        updateTaskWithAJAX();
    } catch (e) {
        $('#errorDiv').append(`<p>Error: ${e}</p>`);
        $('#errorDiv').show();
    }
});

$('#cancelEditButton').on('click', cancelTaskUpdate);