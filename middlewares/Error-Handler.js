const errorHandler = (err, req, res, next) => {
    console.error(err);
    const { statusCode = 500, message } = err;
    res.status(err.statusCode).send({ message: err.message });
    res.status(statusCode).send({
        message:
            statusCode === 500 ? "An error occurred on the server" : message,
    });
};

module.exports = {
    errorHandler,
};
