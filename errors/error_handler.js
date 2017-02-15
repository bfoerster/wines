

module.exports = (request, response, error, callback) => {
    let errorResponse = {error: 'VALIDATION_ERROR', validation: {}};

    for (let current in error.errors) {
        const kind = error.errors[current].kind;

        if (kind === 'required') {
            errorResponse.validation[current] = 'MISSING';
        } else if (kind === 'enum'){
            errorResponse.validation[current] = 'INVALID';
        }
    }
    response.send(400, errorResponse);

    return callback();
};