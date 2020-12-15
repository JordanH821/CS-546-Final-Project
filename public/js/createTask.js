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
    const length = $(subtasks).length;
    if (length === 0) {
        form.append(`<input type="text" name="subtasks" hidden>`);
    } else if (length === 1) {
        $('#subtaskList li').each((index, subtask) => {
            form.append(
                `<input type="text" name="subtasks[0]" value="${$(
                    subtask
                ).text()}">`
            );
        });
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

function addDependenciesToForm() {
    let form = $('#taskForm');
    let dependencies = $('#dependenciesList li');
    const length = $(dependencies).length;
    console.log(length);

    if (length === 0) {
        form.append(`<input type="text" name="dependencies" hidden>`);
    } else if (length === 1) {
        $(dependencies).each((index, dependency) => {
            form.append(
                `<input type="text" name="dependencies[0]" value="${$(
                    dependency
                ).data('id')}">`
            );
        });
    } else {
        $(dependencies).each((index, dependency) => {
            form.append(
                `<input type="text" name="dependencies" value="${$(
                    dependency
                ).data('id')}">`
            );
        });
    }
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
        validateDueDate($('#dueDate').val().trim());
    } catch (e) {
        event.preventDefault();
        valid = false;
        displayError('Check Due date');
    }
    try {
        validateDate($('#reminderDate').val().trim(), 'Reminder Date');
        validateReminderDate(
            $('#reminderDate').val().trim(),
            $('#dueDate').val().trim()
        );
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
        addDependenciesToForm();
    }
});

function setOptionListener(option) {
    $(option).on('click', () => {
        if ($(option).val().trim() === 'Default') return;
        let listItem = $(`<li>${$(option).text()}</li>`);
        listItem.data('id', $(option).val().trim());
        $(option).remove();
        $(listItem).on('click', () => {
            setOptionListener($(option));
            $('#dependenciesSelect').append($(option));
            $(listItem).remove();
        });
        $('#dependenciesList').append(listItem);
    });
}

function setDependencySelectListener() {
    $('#dependenciesSelect option').each((index, option) => {
        if ($(option).val().trim() === 'default') return;
        setOptionListener(option);
    });
}

$('#addSubtaskButton').on('click', () => {
    clearErrors();
    try {
        const escaped = filterXSS($('#subtask').val().trim());
        const subtask = validateStringInput(escaped, 'Subtask');
        const listItem = $('<li class="subtaskItem"></li>');
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

$(setDependencySelectListener);
