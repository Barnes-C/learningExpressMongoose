const HttpStatus = Object.freeze({
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    NOT_MODIFIED: 304,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
    PRECONDITION_FAILED: 412,
    PRECONDITION_REQUIRED: 428,
    INTERNAL_ERROR: 500,
    NOT_YET_IMPLEMENTED: 501,
});

module.exports = HttpStatus;
