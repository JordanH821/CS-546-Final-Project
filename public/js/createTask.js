$('#taskForm').on('submit', (event) => {
    $('#errorDiv').hide();
    $('#errorDiv').empty();
    try {
        validateStringInput($('#title').val().trim(), 'Title');
        validateStringInput($('#description').val().trim(), 'Description');
        // validateSelect($('#priority').val().trim(), 'Priority);
        validateDate($('#dueDate').val().trim(), 'Due Date');
        validateDate($('#reminderDate').val().trim(), 'Reminder Date');
        // validateSelect($('#status').val().trim(), 'Status');
        validateStringInput($('#assignee').val().trim(), 'Assignee');
        // validateTags($('#tags').val().trim(), 'Home');
    } catch (e) {
        event.preventDefault();
        $('#errorDiv').append(`<p>Error: ${e}</p>`);
        $('#errorDiv').show();
    }
});
