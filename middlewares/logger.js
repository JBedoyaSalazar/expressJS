const LoggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString()
    const method = req.method

    console.log(`
        =================================
        [${timestamp}]
        Method:${method}
        URL: ${req.url}
        IP: ${req.ip}
        =================================
    `)

    const start = Date.now()
    res.on('finish', () => {
        const duration = Date.now() - start
        console.log(`
            [${timestamp}]
            Respose: ${res.statusCode}
            Request processed in ${duration}ms`
        )
    })

    next()
}

module.exports = {
    LoggerMiddleware
}