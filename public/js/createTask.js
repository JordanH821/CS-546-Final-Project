function clearErrors() {
    $('#errorDiv').hide();
    $('#errorDiv').empty();
}

function displayError(e) {
    $('#errorDiv').append(`<p>Error: ${e}</p>`);
    $('#errorDiv').show();
}

function addSubtasksToForm() {
    let form = $('#taskForm');
    let subtasks = $('#subtaskList li');
    if ($(subtasks).length === 0) {
        form.append(`<input type="text" name="subtasks" hidden>`);
    } else {
        $('#subtaskList li').each((index, subtask) => {
            form.append(
                `<input type="text" name="subtasks" value="${$(
                    subtask
                ).text()}">`
            );
        });
    }
    $('#subtask').remove();
}

$('#taskForm').on('submit', (event) => {
    clearErrors();
    let valid = true;
    try {
        validateStringInput($('#title').val().trim(), 'Title');
    } catch (e) {
        event.preventDefault();
        valid = false;
        displayError(
            'Title cannot be empty. Please type in a title for this task'
        );
    }
    try {
        validateStringInput($('#description').val().trim(), 'Description');
    } catch (e) {
        event.preventDefault();
        valid = false;
        displayError(
            'Description cannot be empty. Please type in a description for this task'
        );
    }
    try {
        validateSelect($('#priority').val().trim(), 'Priority');
    } catch (e) {
        event.preventDefault();
        valid = false;
        displayError(
            'Description cannot be empty. Please type in a description for this task'
        );
    }
    try {
        validateDate($('#dueDate').val().trim(), 'Due Date');
    } catch (e) {
        event.preventDefault();
        valid = false;
        displayError('Check Due date');
    }
    try {
        validateDate($('#reminderDate').val().trim(), 'Reminder Date');
    } catch (e) {
        event.preventDefault();
        valid = false;
        displayError('Check Reminder date');
    }
    try {
        validateSelect($('#status').val().trim(), 'Status');
    } catch (e) {
        event.preventDefault();
        valid = false;
        displayError('Check status');
    }
    try {
        validateStringInput($('#assignee').val().trim(), 'Assignee');
    } catch (e) {
        event.preventDefault();
        valid = false;
        displayError(
            'Assignee cannot be empty. Please type in an assignee for this task'
        );
    }
    try {
        validateTags($('#tags').val().trim());
    } catch (e) {
        event.preventDefault();
        valid = false;
        displayError(
            'Tags field cannot be empty. Please type in tags for this task'
        );
    }
    if (valid) {
        addSubtasksToForm();
    }
});

$('#addSubtaskButton').on('click', () => {
    clearErrors();
    try {
        const escaped = filterXSS($('#subtask').val().trim());
        const subtask = validateStringInput(escaped, 'Subtask');
        const listItem = $('<li></li>');
        listItem.text(escaped);
        $(listItem).on('click', () => {
            $(listItem).remove();
        });
        $('#subtaskList').append(listItem);
        $('#subtask').val('');
    } catch (e) {
        displayError(e);
    }
});
