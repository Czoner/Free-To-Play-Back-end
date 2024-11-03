const errors = {
    internal_server_error: 500,
    bad_request: 400,
    Not_found: 404,
    Mongo_error: 11000,
    Forbidden_error: 403,
    Conflict_error: 409,
    Unauthorized: 401,
};

module.exports = {
    errors,
};
