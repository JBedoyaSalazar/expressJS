const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send(`
        <h1>Curso Express JS</h1>
        <p>Aplicativo NodeJS con express</p>
        <p>Running on ${PORT}</p>
        `)
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})