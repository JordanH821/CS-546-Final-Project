$('#loginForm').on('submit', (event) => {
    $('#errorDiv').hide();
    $('#errorDiv').empty();
    $('#progressText').show();
    $('#loginBtn').hide();
    try {
        validateEmail($('#email').val().trim());
        validateStringInput($('#password').val().trim(), 'Password');
    } catch (e) {
        event.preventDefault();
        $('#errorDiv').append(`<p>Error: ${e}</p>`);
        $('#errorDiv').show();
        $('#progressText').hide();
        $('#loginBtn').show();

    }
});
