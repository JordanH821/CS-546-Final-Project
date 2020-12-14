function clearErrors() {
    $('#errorDiv').hide();
    $('#errorDiv').empty();
}

function displayError(e) {
    $('#errorDiv').append(`<p>Error: ${e}</p>`);
    $('#errorDiv').show();
}

function addSubtasksToForm() {
    let subtasks = [];
    $('#subtaskList li').each((index, subtask) => {
        subtasks.push($(subtask).text());
    });
    console.log(subtasks.join(','));
    $('#subtasks').val(subtasks.join(','));
    $('subtask').remove();
    // alert('added to from');
}

$('#taskForm').on('submit', (event) => {
    clearErrors();
    try {
        validateStringInput($('#title').val().trim(), 'Title');
        validateStringInput($('#description').val().trim(), 'Description');
        validateSelect($('#priority').val().trim(), 'Priority');
        validateDate($('#dueDate').val().trim(), 'Due Date');
        validateDate($('#reminderDate').val().trim(), 'Reminder Date');
        validateSelect($('#status').val().trim(), 'Status');
        validateStringInput($('#assignee').val().trim(), 'Assignee');
        validateTags($('#tags').val().trim());
        addSubtasksToForm();
    } catch (e) {
        event.preventDefault();
        displayError(e);
    }
});

$('#addSubtaskButton').on('click', () => {
    clearErrors();
    try {
        const subtask = validateStringInput(
            $('#subtask').val().trim(),
            'Subtask'
        );
        const listItem = $(`<li>${subtask}</li>`);
        $(listItem).on('click', () => {
            $(listItem).remove();
        });
        $('#subtaskList').append(listItem);
        $('#subtask').val('');
    } catch (e) {
        displayError(e);
    }
});
