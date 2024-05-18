//errors midlw or next func

const errorMiddleware = (err, req, res, next) => {
    const defaultError = {
        statusCode: 404,
        success: "ошибка",
        message: err,
    } ;

    if(err.name === "ValidationError"){
        defaultError.statusCode = 404;
        defaultError.message = Object.values(err, errors)
        .map((el) => el.message)
        .join(",");
    }

    if(err.code && err.code === 11000) {
        defaultError.statusCode = 404;
        defaultError.message = `${Object.values(err.keyValue)}
        поле должно быть уникальным`;
    }

    res.status(defaultError.statusCode).json({
        success: defaultError.success,
        message: defaultError.message,
    });
};

export default errorMiddleware;