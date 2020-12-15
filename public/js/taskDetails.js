let title,
    description,
    priority,
    dueDate,
    reminderDate,
    status,
    assignee,
    tags,
    subtasks,
    depencies,
    disablingForm,
    originalDependencySelect;

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

function removeDependencyListener() {
    $('#dependenciesList li').each((index, dependency) => {
        $(dependency).off();
    });
}

function setDependencyListener() {
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

function getDependencyList() {
    let form = $('#taskForm');
    let dependencies = $('#dependenciesList li');
    let depList = [];
    dependencies.each((indx, dep) => {
        depList.push($(dep).data('id'));
    });
    return depList;
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

function copyDependenciesBackToOptions() {
    $('#dependenciesList li').each((index, dependency) => {
        const depClone = $(dependency).clone();
        $(depClone).off();
        $(dependency).trigger('click');
        $('#dependenciesList').append(depClone);
    });
}

function resetDependencyList() {
    $('#dependenciesList').empty();
    clickDependencies();
}

function disableForm() {
    disableInput();
    $('#updateTaskButton').hide();
    $('#editTaskButton').show();
    $('#cancelEditButton').hide();
    disablingForm = true;
    copyDependenciesBackToOptions();
    disablingForm = false;
}

function enableForm() {
    getOriginalTaskInfo();
    enableInput();
    $('#updateTaskButton').show();
    $('#editTaskButton').hide();
    $('#cancelEditButton').show();
    $('#newTaskText').hide();
    resetDependencyList();
}

function cloneSelectOptions() {
    let opts = [];
    $('#dependenciesSelect option').each((index, opt) => {
        opts.push($(opt).clone());
    });
    return opts;
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
    originalDependencySelect = cloneSelectOptions();
}

function resetDependencyOptions() {
    let select = $('#dependenciesSelect');
    $(select).empty();
    originalDependencySelect.forEach((opt) => {
        $(select).append(opt);
    });
    $('#dependenciesList').empty();
    setDependencySelectListener();
    clickDependencies();
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
    resetDependencyOptions();
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
        dependencies: getDependencyList(),
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

function setOptionListener(option) {
    $(option).on('click', () => {
        if ($(option).val().trim() === 'Default') return;
        let listItem = $(`<li>${$(option).text()}</li>`);
        listItem.data('id', $(option).val().trim());
        $(option).addClass('dependency');
        $(option).remove();
        $(listItem).on('click', () => {
            setOptionListener($(option));
            if (!disablingForm) $(option).removeClass('dependency');
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

function clickDependencies() {
    $('.dependency').each((index, option) => {
        $(option).trigger('click');
    });
}

$('#editTaskButton').on('click', enableForm);

$('#updateTaskButton').on('click', (event) => {
    event.preventDefault();
    try {
        validateTaskUpdates();
        // disableForm();
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
$(setDependencySelectListener);
$(clickDependencies);
$(disableForm);
