$('#taskForm').on('submit', event => {
  $('#errorDiv').hide();
  $('#errorDiv').empty();
  try {
    validateStringInput(
      $('#title')
        .val()
        .trim(),
      'Title'
    );
  } catch (e) {
    event.preventDefault();
    let errString = `Title cannot be empty. Please type in a title for this task`;
    $('#errorDiv').append(`<p>Error: ${errString}</p>`);
    $('#errorDiv').show();
  }
  try {
    validateStringInput(
      $('#description')
        .val()
        .trim(),
      'Description'
    );
  } catch (e) {
    let errString = `Description cannot be empty. Please type in a description for this task`;
    $('#errorDiv').append(`<p>Error: ${errString}</p>`);
    $('#errorDiv').show();
  }

  try {
    validateSelect(
      $('#priority')
        .val()
        .trim(),
      'Priority'
    );
  } catch (e) {
    let errString = `Description cannot be empty. Please type in a description for this task`;
    $('#errorDiv').append(`<p>Error: ${errString}</p>`);
    $('#errorDiv').show();
  }
  try {
    validateDate(
      $('#dueDate')
        .val()
        .trim(),
      'Due Date'
    );
  } catch (e) {
    let errString = `Check Due date`;
    $('#errorDiv').append(`<p>Error: ${errString}</p>`);
    $('#errorDiv').show();
  }
  try {
    validateDate(
      $('#reminderDate')
        .val()
        .trim(),
      'Reminder Date'
    );
  } catch (e) {
    let errString = `Check Reminder date`;
    $('#errorDiv').append(`<p>Error: ${errString}</p>`);
    $('#errorDiv').show();
  }
  try {
    validateSelect(
      $('#status')
        .val()
        .trim(),
      'Status'
    );
  } catch (e) {
    let errString = `Check status`;
    $('#errorDiv').append(`<p>Error: ${errString}</p>`);
    $('#errorDiv').show();
  }
  try {
    validateStringInput(
      $('#assignee')
        .val()
        .trim(),
      'Assignee'
    );
  } catch (e) {
    let errString = `Assignee cannot be empty. Please type in an assignee for this task`;
    $('#errorDiv').append(`<p>Error: ${errString}</p>`);
    $('#errorDiv').show();
  }
  try {
    validateTags(
      $('#tags')
        .val()
        .trim()
    );
  } catch (e) {
    let errString = `Tags field cannot be empty. Please type in tags for this task`;
    $('#errorDiv').append(`<p>Error: ${errString}</p>`);
    $('#errorDiv').show();
  }
});
