$('#signUpForm').on('submit', (event) => {
    $('#errorDiv').hide();
    $('#errorDiv').empty();
    try {
        validateStringInput($('#firstName').val().trim(), 'First Name');
        validateStringInput($('#lastName').val().trim(), 'Last Name');
        validateEmail($('#email').val().trim());
        validateStringInput($('#password').val().trim(), 'Password');
        validatePhoneNumber($('#mobileNumber').val().trim(), 'Mobile');
        validatePhoneNumber($('#homeNumber').val().trim(), 'Home');
        validatePhoneNumber($('#workNumber').val().trim(), 'Work');
    } catch (e) {
        event.preventDefault();
        $('#errorDiv').append(`<p>Error: ${e}</p>`);
        $('#errorDiv').show();
    }
});
