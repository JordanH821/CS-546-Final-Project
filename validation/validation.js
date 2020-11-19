function validateStringInput(input, name) {
    if (input === undefined || input === null)
        throw `${name} is null or undefined, but must be a non-empty string`;
    if (typeof input !== 'string')
        throw `${name} is of type ${typeof input}, but must be a string`;
    if (!input)
        throw `${name} is an empty string, but must be a string with at least one character`;
    // check for all whitespace
    // https://stackoverflow.com/questions/6623231/remove-all-white-spaces-from-text
    if (input.replace(/\s/g, '').length === 0)
        throw `string cannot be all white space`;
    // return successfully validated string without trailing and preceedig whitespace
    return input.trim();
}

function ValidateEmail(email) {}

module.exports = { validateStringInput };
