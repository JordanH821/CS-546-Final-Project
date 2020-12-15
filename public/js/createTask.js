<<<<<<< HEAD
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
    return;
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
    return;
  }

  try {
    validateSelect(
      $('#priority')
        .val()
        .trim(),
      'Priority'
    );
  } catch (e) {
    let errString = `Priority cannot be empty. Please type in a priority for this task`;
    $('#errorDiv').append(`<p>Error: ${errString}</p>`);
    $('#errorDiv').show();
    return;
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
    return;
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
    return;
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
    return;
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
    return;
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
    return;
  }
=======
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
    $('#subtaskList li').each((index, subtask) => {
        form.append(
            `<input type="text" name="subtasks" value="${$(subtask).text()}">`
        );
    });
    $('#subtask').remove();
}

$('#taskForm').on('submit', (event) => {
    clearErrors();
    try {
        validateStringInput($('#title').val().trim(), 'Title');
    } catch (e) {
        event.preventDefault();
        displayError(
            'Title cannot be empty. Please type in a title for this task'
        );
    }
    try {
        validateStringInput($('#description').val().trim(), 'Description');
    } catch (e) {
        displayError(
            'Description cannot be empty. Please type in a description for this task'
        );
    }
    try {
        validateSelect($('#priority').val().trim(), 'Priority');
    } catch (e) {
        displayError(
            'Description cannot be empty. Please type in a description for this task'
        );
    }
    try {
        validateDate($('#dueDate').val().trim(), 'Due Date');
    } catch (e) {
        displayError('Check Due date');
    }
    try {
        validateDate($('#reminderDate').val().trim(), 'Reminder Date');
    } catch (e) {
        displayError('Check Reminder date');
    }
    try {
        validateSelect($('#status').val().trim(), 'Status');
    } catch (e) {
        displayError('Check status');
    }
    try {
        validateStringInput($('#assignee').val().trim(), 'Assignee');
    } catch (e) {
        displayError(
            'Assignee cannot be empty. Please type in an assignee for this task'
        );
    }
    try {
        validateTags($('#tags').val().trim());
    } catch (e) {
        displayError(
            'Tags field cannot be empty. Please type in tags for this task'
        );
    }
    addSubtasksToForm();
>>>>>>> main
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
