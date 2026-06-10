require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send(`
        <h1>Curso Express JS</h1>
        <p>Aplicativo NodeJS con express</p>
        <p>Running on ${PORT}</p>
        `)
})

app.get('/users/:id', (req, res) => {
    const userId = req.params.id
    res.send(`Mostrar informacion del usuarion con ID: ${userId}`)
})

app.get('/search', (req, res) => {
    const terms = req.query.terms || `No especificado`
    const category = req.query.category || `Todas`
    res.send(`
        <h2>Resultados De Busqueda</h2>
        <p>Termino: ${terms}</p>
        <p>Categoria: ${category}</p>
        `)
})

app.post('/form', (req, res) => {
    const name = req.body.name || `Anonimo`
    const email = req.body.email || `N/G`
    res.status(201).json({
        message: `Datos recibidos con exito`,
        data: {
            name,
            email
        }
    })
})

app.post('/api/data', (req, res) => {
    const data = req.body
    if(!data || Object.keys(data).length === 0){
        return res.status(400).json( {error: 'No se han recibido datos'})
    }

    res.status(201).json({
        message: "Datos JSON recibidos",
        data
    })
})

app.listen(PORT, () => {
    console.log(`Listening On http://localhost:${PORT}`)
})