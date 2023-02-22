function createResponse(res, { status, responseData }){
    const statusCode = status || 200;
    if (statusCode >= 400) {
        return res.status(statusCode).json({ error: responseData || 'Something wents wrong!!' });
    }
    if (typeof responseData === 'number' || typeof responseData === 'string') {
        return res.status(statusCode).send(responseData);
    }
    return res.status(statusCode).json(responseData);
}

export default createResponse;
