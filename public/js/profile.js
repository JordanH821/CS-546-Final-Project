let firstName, lastName, mobileNumber, homeNumber, workNumber;


function disableForm() {
    $('input[type="text"]').attr('disabled', true);
    $('#updateProfileButton').hide();
    $('#editProfileButton').show();
    $('#cancelEditButton').hide();
}

function enableForm() {
    getOriginalProfileInfo();
    $('input[type="text"]').attr('disabled', false);
    $('#updateProfileButton').show();
    $('#editProfileButton').hide();
    $('#cancelEditButton').show();
}

function getOriginalProfileInfo() {
    firstName = $('#firstName').val().trim();
    lastName = $('#lastName').val().trim();
    mobileNumber = $('#mobileNumber').val().trim();
    homeNumber = $('#homeNumber').val().trim();
    workNumber = $('#workNumber').val().trim();
}
function cancelProfileUpdate() {
    $('#firstName').val(firstName);
    $('#lastName').val(lastName);
    $('#mobileNumber').val(mobileNumber);
    $('#homeNumber').val(homeNumber);
    $('#workNumber').val(workNumber);
    clearErrors();
    disableForm();
}

function validateProfileUpdates() {
    $('#errorDiv').hide();
    $('#errorDiv').empty();
    try {
        validateStringInput($('#firstName').val().trim(), 'First Name');
    } catch {
        throw 'Please enter your first name.';
    }
    try {
        validateStringInput($('#lastName').val().trim(), 'Last Name');
    } catch {
        throw 'Please enter your last name.';
    }
    try {
        validatePhoneNumber($('#mobileNumber').val().trim(), 'Mobile');
    } catch {
        throw 'Please enter your mobile number.';
    }
    try {
        validatePhoneNumber($('#homeNumber').val().trim(), 'Home');
    } catch {
        throw 'Please enter your home number.';
    }
    try {
        validatePhoneNumber($('#workNumber').val().trim(), 'Work');
    } catch {
        'Please enter your work number.';
    }
}

function getFormValues() {
    return {
        firstName: $('#firstName').val().trim(),
        lastName: $('#lastName').val().trim(),
        mobileNumber: $('#mobileNumber').val().trim(),
        homeNumber: $('#homeNumber').val().trim(),
        workNumber: $('#workNumber').val().trim(),
    };
}

function handleAJAXError(error) {
    $('#errorDiv').append(
        `<p>There was an error while updating your profile. Please try again later.</p>`
    );
    $('#errorDiv').show();
}

function clearErrors() {
    $('#errorDiv').empty();
    $('#errorDiv').hide();
}

function updateProfileWithAJAX() {
    const requestConfig = {
        method: 'POST',
        url: '/users/profile/update',
        data: JSON.stringify(getFormValues()),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: disableForm,
        error: handleAJAXError,
    };

    $.ajax(requestConfig);
}

$(disableForm);

$('#editProfileButton').on('click', enableForm);

$('#updateProfileButton').on('click', (event) => {
    event.preventDefault();
    try {
        validateProfileUpdates();
        disableForm();
        updateProfileWithAJAX();
    } catch (e) {
        $('#errorDiv').append(`<p>Error: ${e}</p>`);
        $('#errorDiv').show();
    }
});

$('#cancelEditButton').on('click', cancelProfileUpdate);