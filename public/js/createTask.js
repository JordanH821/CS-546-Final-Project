let createTaskForm = $('#createTaskForm'),
  title = $('#title'),
  description = $('#description'),
  priority = $('#priority');
(dueDate = $('#dueDate')),
  (reminderDate = $('#reminderDate')),
  (status = $('#status')),
  (tags = $('#tags'));
createTaskBtn = $('#createTask-btn');
(error = $('.pop-error')), (assignee = $('#assignee'));

// frontend validation
//

$(function() {
  // Initialize form validation on the registration form.
  // It has the name attribute "registration"
  $("form[name='createTaskForm']").validate({
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      title: 'required',
      description: 'required',
      dueDate: 'required',
      reminderDate: 'required',
      assignee: 'required',
      tags: 'required'
    },

    // Specify validation error messages
    messages: {
      title: 'Please enter task title',
      description: 'Please task description',
      dueDate: 'Please set task due date',
      reminderDate: 'Please set task reminder date',
      assignee: 'Please set assignee(s)',
      tags: 'Please set tag(s)'
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      form.submit();
    }
  });
});
