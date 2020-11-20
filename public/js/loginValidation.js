$('#loginForm').on('submit', (event) => {
    $('#errorDiv').hide();
    $('#errorDiv').empty();
    try {
        validateEmail($('#email').val().trim());
        validateStringInput($('#password').val().trim(), 'Password');
    } catch (e) {
        event.preventDefault();
        $('#errorDiv').append(`<p>Error: ${e}</p>`);
        $('#errorDiv').show();
    }
});
