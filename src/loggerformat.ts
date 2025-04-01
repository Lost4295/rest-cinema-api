import {Request, Response} from 'express'

const formatHTTPLoggerResponse = (
    req: Request,
    res: Response,
    responseBody: unknown
) => {

    return {
        request: {
            headers: req.headers,
            host: req.headers.host,
            baseUrl: req.baseUrl,
            url: req.url,
            method: req.method,
            body: req.body,
            params: req?.params,
            query: req?.query,
            clientIp: req?.socket.remoteAddress,
        },
        response: {
            headers: res.getHeaders(),
            statusCode: res.statusCode,
            body: responseBody,
        }
    }
}

export default formatHTTPLoggerResponse
