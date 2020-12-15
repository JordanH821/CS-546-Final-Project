let title,
    description,
    priority,
    dueDate,
    reminderDate,
    status,
    assignee,
    tags,
    subtasks;

function removeSubtaskListener() {
    $('#subtaskList li').each((index, subtask) => {
        $(subtask).off();
    });
}

function setSubtaskListener() {
    $('#subtaskList li').each((index, subtask) => {
        $(subtask).on('click', () => {
            $(subtask).remove();
        });
    });
}

function getSubtaskList() {
    let subtaskList = [];
    $('#subtaskList li').each((index, subtask) => {
        subtaskList.push($(subtask).text());
    });
    subtasks = subtaskList;
    return subtasks;
}

function resetSubtasks() {
    $('#subtaskList').empty();
    for (let subtask of subtasks) {
        let escaped = filterXSS(subtask);
        let listItem = $('<li></li>');
        listItem.text(escaped);
        $('#subtaskList').append(listItem);
    }
}

function disableInput() {
    $('input').attr('disabled', true);
    $('select').attr('disabled', true);
    $('textarea').attr('disabled', true);
    $('#subtaskCreation').hide();
    removeSubtaskListener();
}

function enableInput() {
    $('input').attr('disabled', false);
    $('select').attr('disabled', false);
    $('textarea').attr('disabled', false);
    $('#subtaskCreation').show();
    setSubtaskListener();
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
    $('#newTaskText').hide();
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
    getSubtaskList();
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
    resetSubtasks();
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
        subtasks: getSubtaskList(),
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

function displayError(e) {
    $('#errorDiv').append(`<p>Error: ${e}</p>`);
    $('#errorDiv').show();
}

function setNotificationTimeout() {
    setTimeout(() => {
        $('#notificationDiv').empty();
    }, 5000);
}

function alertUserUpdateSuccess() {
    $('#notificationDiv').append(
        '<p class="notification">Task updated successfully!</p>'
    );
    setNotificationTimeout();
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

    $.ajax(requestConfig).then(function (res) {
        if (res.updated && res.updated == true) {
            alertUserUpdateSuccess();
        }
    });
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
        displayError(e);
    }
});

$('#cancelEditButton').on('click', cancelTaskUpdate);

$('#addSubtaskButton').on('click', () => {
    clearErrors();
    try {
        const escaped = filterXSS($('#subtask').val().trim());
        validateStringInput(escaped, 'Subtask');
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

$(setNotificationTimeout);
