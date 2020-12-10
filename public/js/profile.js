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
    validateStringInput($('#firstName').val().trim(), 'First Name');
    validateStringInput($('#lastName').val().trim(), 'Last Name');
    validatePhoneNumber($('#mobileNumber').val().trim(), 'Mobile');
    validatePhoneNumber($('#homeNumber').val().trim(), 'Home');
    validatePhoneNumber($('#workNumber').val().trim(), 'Work');
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
    $('#errorDiv').append(`<p>Error: ${JSON.stringify(error)}</p>`);
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
